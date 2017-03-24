import 'rxjs/add/operator/toPromise';
import { EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Validator } from 'jsonschema';
import { Environment, User } from '../types';
import { environment as env } from '../../environments/environment';
import { ConfigurationService } from '.';
import schemas from '../schemas';

const DEFAULT_ERROR_MESSAGE = 'Unexpected server error. Please report an issue to https://github.com/bponomarenko/autoconfig-app/issues.'

interface DeleteEnvironmentParams {
  user: User;
  environmentName: string;
}

interface UpdateEnvironmentParams {
  user: User;
  environmentName: string;
  ttl: string;
}

interface CreateEnvironmentParams {
  user: User;
  stack: string;
  data: any;
}

interface CreateEnvironmentResponse {
  message: string;
  environment_name: string;
}

interface LoadLogsParams {
  user: User;
  environmentName: string;
}

@Injectable()
export class EnvironmentsService {
  private _environments: Environment[];
  private _stacks: string[];
  private _validator: Validator;

  loadingStacks: boolean = false;
  loadingEnvironments: boolean = false;
  creatingEnvironment: boolean = false;
  onChange: EventEmitter<Environment[]>;
  onLoading: EventEmitter<null>;
  onLoadError: EventEmitter<Error>;
  onValidationError: EventEmitter<string[]>;

  constructor(private http: Http, private confService: ConfigurationService) {
    this.onChange = new EventEmitter<Environment[]>();
    this.onLoading = new EventEmitter<null>();
    this.onLoadError = new EventEmitter<Error>();
    this.onValidationError = new EventEmitter<string[]>();
    this._validator = new Validator();
    this._validator.addSchema(schemas.EnvironmentSchema, '/Environment');
  }

  get environments(): Environment[] {
    return this._environments;
  }

  get stacks(): string[] {
    return this._stacks;
  }

  private get baseUrl(): string {
    return env.apiUrl || this.confService.baseUrl;
  }

  loadStacks(): Promise<string[]> {
    if(this.loadingStacks) {
      return null;
    }

    this.loadingStacks = true;

    return this.http.get(`${this.baseUrl}stacks/`)
      .toPromise()
      .then(this.transformResponse)
      .then(stacks => {
        this._stacks = stacks.sort();
        this.loadingStacks = false;
        return this._stacks;
      })
      .then(this.validateResponse(schemas.StacksSchema))
      .catch(error => {
        this.loadingStacks = false;
        this.throwParsedError(error);
      });
  }

  loadEnvironments(): Promise<Environment[]> {
    if(this.loadingEnvironments) {
      return null;
    }

    this.onLoading.emit();
    this.loadingEnvironments = true;

    return this.http.get(`${this.baseUrl}environments/`)
      .toPromise()
      .then(this.transformResponse)
      .then(environments => {
        this._environments = environments;
        this.loadingEnvironments = false;
        this.onChange.emit(this._environments);
        return this._environments;
      })
      .then(this.validateResponse(schemas.EnvironmentsSchema))
      .catch(error => {
        this.loadingEnvironments = false;
        this.onLoadError.emit(this.parseError(error));
      });
  }

  loadEnvironment(name: string): Promise<Environment> {
    return this.http.get(`${this.baseUrl}environments/${name}`)
      .toPromise()
      .then(this.transformResponse)
      .then(environment => {
        const index = this._environments.findIndex((env: Environment) => env.name === environment.name);
        if (index === -1) {
          this._environments.push(environment)
        } else {
          this._environments[index] = environment;
        }
        this.onChange.emit(this._environments);
        return environment;
      })
      .then(this.validateResponse(schemas.EnvironmentSchema))
      .catch(error => this.throwParsedError(error));
  }

  deleteEnvironment(params: DeleteEnvironmentParams): Promise<null> {
    const options = this.getRequestOptionsWithCredentials(params.user);

    return this.http.delete(`${this.baseUrl}environments/${params.environmentName}`, options)
      .toPromise()
      .then(response => {
        // Remove environment from the local collection
        this._environments = this._environments.filter((env: Environment) => env.name !== params.environmentName);
        this.onChange.emit(this._environments);
        return response;
      })
      .catch(error => {
        this.throwParsedError(error);
      });
  }

  updateEnvironment(params: UpdateEnvironmentParams): Promise<null> {
    const options = this.getRequestOptionsWithCredentials(params.user);
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.put(`${this.baseUrl}environments/${params.environmentName}`, this.encodeBody({ ttl: params.ttl }), options)
      .toPromise()
      .then(this.transformResponse)
      .catch(error => {
        this.throwParsedError(error);
      });
  }

  createEnvironment(params: CreateEnvironmentParams): Promise<CreateEnvironmentResponse> {
    if(this.creatingEnvironment) {
      return null;
    }

    this.creatingEnvironment = true;
    const options = this.getRequestOptionsWithCredentials(params.user);
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${this.baseUrl}stacks/${params.stack}`, this.encodeBody(params.data), options)
      .toPromise()
      .then(this.transformResponse)
      .then(response => {
        this.creatingEnvironment = false;
        return response;
      })
      .then(this.validateResponse(schemas.ProvisionResponseSchema))
      .catch(error => {
        this.creatingEnvironment = false;
        this.throwParsedError(error);
      });
  }

  loadEnvironmentLogs(params: LoadLogsParams): Promise<string> {
    const options = this.getRequestOptionsWithCredentials(params.user);

    return this.http.get(`${this.baseUrl}logs/${params.environmentName}/ansible`, options)
      .toPromise()
      .then(response => {
        return response;
      })
      .then(this.transformResponse)
      .catch(error => {
        this.throwParsedError(error);
      });
  }

  private parseError(error: Response) {
    let message;

    if (error.headers && error.headers.get('Content-Type') === 'application/json') {
      // If response in JSON, try to parse it and get internal message
      const errorObj = error.json();
      message = errorObj && (errorObj.message || errorObj.error);

      if(typeof message === 'object') {
        message = Object.keys(message)
          .reduce((res, key) => {
            res.push(`Parameter "${key}" is invalid – ${message[key]}.`);
            return res;
          }, [])
          .join(' ');
      }
    }

    const statusText = error.statusText ? `[${error.statusText}] ` : '';
    return new Error(`${statusText}${message || DEFAULT_ERROR_MESSAGE}`);
  }

  private throwParsedError(error: Response) {
    throw this.parseError(error);
  }

  private getRequestOptionsWithCredentials(user: User): RequestOptionsArgs {
    const authString = window.btoa((<any>window).unescape(encodeURIComponent(`${user.email}:${user.password}`)));
    return {
      headers: new Headers({
        'Authorization': `Basic ${authString}`
      }),
      withCredentials: true
    };
  }

  private encodeBody(data: any) {
    return Object.keys(data)
      .reduce((res, key) => {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        return res;
      }, [])
      .join('&');
  }

  private transformResponse(response: any) {
    const isJSON = response.headers && response.headers.get('Content-Type') === 'application/json';
    const data = isJSON ? response.json() : response.text();
    return isJSON && env.mocks ? data.data : data;
  }

  private validateResponse(schema: any) {
    return (response: any) => {
      // Validate response against JSON Schema
      try {
        const validationResult = this._validator.validate(response, schema);

        if(validationResult.errors && validationResult.errors.length) {
          this.onValidationError.emit(validationResult.errors.map((error: any) => error.stack));
        }
      } catch(e) {
        // Catch validation unhandled errors
        this.onValidationError.emit([e.message]);
      }
      return response;
    };
  }
}
