import 'rxjs/add/operator/toPromise';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { validate } from 'jsonschema';

import {
  Environment,
  CreateEnvironmentOptions,
  RemoveEnvironmentOptions
} from '../types/environment';
import environmentsSchema from './schemas/environments.json';

const BASE_URL = 'https://autoconfig.backbase.com/api/';

@Injectable()
export class EnvironmentsService {
  onValidationError: EventEmitter<string[]>;

  constructor(private http: Http) {
    this.onValidationError = new EventEmitter<string[]>();
  }

  getAll(): Promise<Environment[]> {
    return this.http.get(`${BASE_URL}environments`)
      .toPromise()
      .then(response => response.json() as Environment[])
      // Uncomment next line when using static mock data
      // .then((response: any) => response.data as Environment[])
      .then(this._validateResponse(environmentsSchema))
      .catch(this._transformErrorResponse);
  }

  create(params: CreateEnvironmentOptions): Promise<null> {
    const options = this._getRequestOptionsWithCredentials(params.username, params.password);
    options.headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(`${BASE_URL}stacks/${params.stackName}`, JSON.stringify(params.data), options)
      .toPromise()
      .then(response => response.json())
      .catch(this._transformErrorResponse);
  }

  remove(params: RemoveEnvironmentOptions): Promise<null> {
    const options = this._getRequestOptionsWithCredentials(params.username, params.password);

    return this.http.delete(`${BASE_URL}environments/${params.environmentName}`, options)
      .toPromise()
      .catch(this._transformErrorResponse);
  }

  getStacks(): Promise<string[]> {
    return this.http.get(`${BASE_URL}stacks`)
      .toPromise()
      .then(response => response.json() as string[])
      .catch(this._transformErrorResponse);
  }

  private _transformErrorResponse(error: any) {
    let message = 'Unexpected server error. Please report an issue to https://github.com/bponomarenko/autoconfig-app/issues.';
    throw new Error(message);
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
}
