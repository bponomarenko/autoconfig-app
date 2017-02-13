import 'rxjs/add/operator/toPromise';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { validate } from 'jsonschema';
import { Environment, User, CreateEnvironmentFormData } from '../types';
import schemas from '../schemas';

const DEFAULT_ERROR_MESSAGE = 'Unexpected server error. Please report an issue to https://github.com/bponomarenko/autoconfig-app/issues.'
const BASE_URL = 'http://localhost:3000/api/';
// const BASE_URL = 'https://autoconfig.backbase.com/api/';

interface DeleteEnvironmentParams {
  user: User;
  environmentName: string;
}

interface CreateEnvironmentParams {
  user: User;
  data: CreateEnvironmentFormData;
}

interface CreateEnvironmentResponse {
  message: string;
  environment_name: string;
}

@Injectable()
export class EnvironmentsService {
  private _environments: Environment[];
  private _stacks: string[];
  loadingStacks: boolean = false;
  loadingEnvironments: boolean = false;
  deletingEnvironment: boolean = false;
  creatingEnvironment: boolean = false;
  onLoad: EventEmitter<null>;
  onLoadError: EventEmitter<Error>;
  onValidationError: EventEmitter<string[]>;

  constructor(private http: Http) {
    this.onLoad = new EventEmitter<null>();
    this.onLoadError = new EventEmitter<Error>();
    this.onValidationError = new EventEmitter<string[]>();
  }

  get environments(): Environment[] {
    return this._environments;
  }

  get stacks(): string[] {
    return this._stacks;
  }

  loadStacks(): Promise<string[]> {
    if(this.loadingStacks) {
      return null;
    }

    this.loadingStacks = true;

    return this.http.get(`${BASE_URL}stacks/`)
      .toPromise()
      .then(response => {
        this._stacks = response.json();
        this.loadingStacks = false;
        return this._stacks;
      })
      .then(this._validateResponse(schemas.StacksSchema))
      .catch(error => {
        this.loadingStacks = false;
        this._throwParsedError(error);
      });
  }

  loadEnvironments(): Promise<Environment[]> {
    if(this.loadingEnvironments) {
      return null;
    }

    this.onLoad.emit();
    this.loadingEnvironments = true;

    return this.http.get(`${BASE_URL}environments/`)
      .toPromise()
      .then(response => {
        this._environments = response.json();
        this.loadingEnvironments = false;
        return this._environments;
      })
      .then(this._validateResponse(schemas.EnvironmentsSchema))
      .catch(error => {
        this.loadingEnvironments = false;
        this.onLoadError.emit(this._parseError(error));
      });
  }

  deleteEnvironment(params: DeleteEnvironmentParams): Promise<null> {
    if(this.deletingEnvironment) {
      return null;
    }

    this.deletingEnvironment = true;
    const options = this._getRequestOptionsWithCredentials(params.user);

    return this.http.delete(`${BASE_URL}environments/${params.environmentName}`, options)
      .toPromise()
      .then(response => {
        this.deletingEnvironment = false;
        // Remove environment from the local collection
        this._environments = this._environments.filter((env: Environment) => env.name !== params.environmentName);
        return response;
      })
      .catch(error => {
        this.deletingEnvironment = false;
        this._throwParsedError(error);
      });
  }

  createEnvironment(params: CreateEnvironmentParams): Promise<CreateEnvironmentResponse> {
    if(this.creatingEnvironment) {
      return null;
    }

    this.creatingEnvironment = true;
    const options = this._getRequestOptionsWithCredentials(params.user);
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${BASE_URL}stacks/${params.data.stack}`, this._encodeBody(params.data), options)
      .toPromise()
      .then(response => {
        this.creatingEnvironment = false;
        return response.json();
      })
      .then(this._validateResponse(schemas.ProvisionResponseSchema))
      .catch(error => {
        this.creatingEnvironment = false;
        this._throwParsedError(error);
      });
  }

  private _parseError(error: any) {
    let message;

    if (error.headers && error.headers.get('Content-Type') === 'application/json') {
      // If response in JSON, try to parse it and get internal message
      const errorObj = error.json();
      message = errorObj && errorObj.message;

      if(typeof message === 'object') {
        message = Object.keys(message)
          .reduce((res, key) => {
            res.push(`Parameter "${key}" is invalid – ${message[key]}.`);
            return res;
          }, [])
          .join(' ');
      }
    }

    return new Error(message || DEFAULT_ERROR_MESSAGE);
  }

  private _throwParsedError(error: any) {
    throw this._parseError(error);
  }

  private _getRequestOptionsWithCredentials(user: User): RequestOptionsArgs {
    const authString = window.btoa((<any>window).unescape(encodeURIComponent(`${user.email}:${user.password}`)));
    return {
      headers: new Headers({
        'Authorization': `Basic ${authString}`
      }),
      withCredentials: true
    };
  }

  private _encodeBody(data: any) {
    return Object.keys(data)
      .reduce((res, key) => {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        return res;
      }, [])
      .join('&');
  }

  private _validateResponse(schema: any) {
    return (response: any) => {
      // Validate response against JSON Schema
      const validationResult = validate(response, schema);

      if(validationResult.errors && validationResult.errors.length) {
        this.onValidationError.emit(validationResult.errors.map((error: any) => error.stack));
      }
      return response;
    };
  }
}
