import { NgForm } from '@angular/forms';

import { FieldConfiguration } from './field-configuration';

export class FieldsConfiguration {
  private _fields: FieldConfiguration[] = [];
  private _fieldDependents = {};

  constructor(config: Array<any>) {
    this._fields = config.map(conf => new FieldConfiguration(conf, this));

    this._fields.forEach(fieldConfig => { this._fieldDependents[fieldConfig.name] = [] });
    this._fields.forEach(fieldConfig => {
      fieldConfig.onChange.subscribe(() => this.onFieldValueChange(fieldConfig.name));
      fieldConfig.dependencies.forEach(dependency => {
        this._fieldDependents[dependency].push(fieldConfig.name);
      });
    });
  }

  get fields(): FieldConfiguration[] {
    return this._fields.filter(field => field.isAvailable);
  }

  getField(name: string) {
    return this._fields.find(field => field.name === name);
  }

  getFieldSafeValue(name: string) {
    const field = this.getField(name);
    return (field && field.value) || '';
  }

  setData(data: any) {
    Object.keys(data).forEach(key => {
      const field = this.getField(key);
      if(field) {
        field.value = data[key];
      }
    });
  }

  private onFieldValueChange(fieldName: string) {
    this._fieldDependents[fieldName].forEach(dependent => this.getField(dependent).filterValues());
  }
}
