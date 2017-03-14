import { NgForm } from '@angular/forms';

import { FieldConfiguration } from './field-configuration';

export class FieldsConfiguration {
  private _fields: FieldConfiguration[] = [];
  private _filteredFields: FieldConfiguration[];
  private _fieldDependents = {};
  private _filterTimeout;
  private _processingFields: string[] = [];

  constructor(config: Array<any>) {
    config.forEach(conf => {
      this._fields.push(new FieldConfiguration(conf, this));
      this._fieldDependents[conf.name] = [];
    });

    this._fields.forEach(fieldConfig => {
      fieldConfig.onChange.subscribe(() => this.onFieldValueChange(fieldConfig.name));
      fieldConfig.dependencies.forEach(dependency => {
        this._fieldDependents[dependency].push(fieldConfig.name);
      });
    });

    this.delayFilterUpdate();
  }

  get fields(): FieldConfiguration[] {
    return this._filteredFields;
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
    if(!this._processingFields.includes(fieldName)) {
      this._processingFields.push(fieldName);
      this._fieldDependents[fieldName].forEach(dependent => this.getField(dependent).updateProperties());
      this.delayFilterUpdate();
    }
  }

  private delayFilterUpdate() {
    if(this._filterTimeout) {
      clearTimeout(this._filterTimeout);
    }
    this._filterTimeout = setTimeout(() => this.filterFields(), 50);
  }

  private filterFields() {
    this._processingFields = [];
    this._filteredFields = this._fields
      .filter(field => field.isAvailable)
      .sort((f1, f2) => {
        if((f1.isCheckbox && f2.isCheckbox) || (!f1.isCheckbox && !f2.isCheckbox)) {
          return this._fields.indexOf(f1) - this._fields.indexOf(f2);
        } else {
          return f1.isCheckbox ? 1 : -1;
        }
      });
  }
}
