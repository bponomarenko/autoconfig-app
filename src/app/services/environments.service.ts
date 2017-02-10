import 'rxjs/add/operator/toPromise';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { validate } from 'jsonschema';

import { Environment, CreateEnvironmentOptions, RemoveEnvironmentOptions } from '../types/environment';
import schemas from './schemas';

const BASE_URL = 'http://localhost:3000/api/';
const DEFAULT_ERROR_MESSAGE = 'Unexpected server error. Please report an issue to https://github.com/bponomarenko/autoconfig-app/issues.'

@Injectable()
export class EnvironmentsService {
  onValidationError: EventEmitter<string[]>;

  constructor(private http: Http) {
    this.onValidationError = new EventEmitter<string[]>();
  }

  getAll(): Promise<Environment[]> {
    return this.http.get(`${BASE_URL}environments/`)
      .toPromise()
      .then(response => response.json() as Environment[])
      // Uncomment next line when using static mock data
      // .then((response: any) => response.data as Environment[])
      .then(this._validateResponse(schemas.EnvironmentsSchema))
      .catch(this._transformErrorResponse);
  }

  create(params: CreateEnvironmentOptions): Promise<null> {
    const options = this._getRequestOptionsWithCredentials(params.username, params.password);
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(`${BASE_URL}stacks/${params.stackName}`, this._encodeBody(params.data), options)
      .toPromise()
      .then(response => response.json())
      .then(this._validateResponse(schemas.ProvisionResponseSchema))
      .catch(this._transformErrorResponse);
  }

  remove(params: RemoveEnvironmentOptions): Promise<null> {
    const options = this._getRequestOptionsWithCredentials(params.username, params.password);

    return this.http.delete(`${BASE_URL}environments/${params.environmentName}`, options)
      .toPromise()
      .catch(this._transformErrorResponse);
  }

  getStacks(): Promise<string[]> {
    return this.http.get(`${BASE_URL}stacks/`)
      .toPromise()
      .then(response => response.json() as string[])
      .catch(this._transformErrorResponse);
  }

  private _transformErrorResponse(error: any) {
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

    throw new Error(message || DEFAULT_ERROR_MESSAGE);
  }

  private _getRequestOptionsWithCredentials(username: string, password: string): RequestOptionsArgs {
    const authString = window.btoa((<any>window).unescape(encodeURIComponent(`${username}:${password}`)));
    return {
      headers: new Headers({
        'Authorization': `Basic ${authString}`
      }),
      withCredentials: true
    };
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

  private _encodeBody(data: any) {
    return Object.keys(data)
      .reduce((res, key) => {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
        return res;
      }, [])
      .join('&');
  }
}
