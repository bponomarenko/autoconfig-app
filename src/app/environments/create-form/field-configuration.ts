import { EventEmitter } from '@angular/core';

import { FieldsConfiguration } from './fields-configuration';

export class FieldConfiguration {
  private _config: any;
  private _fieldsConfig: FieldsConfiguration;
  private _values: Array<any>;
  private _filteredValues: Array<string> = [];
  private _value: string;
  private _isCheckbox: boolean;

  onChange: EventEmitter<string>;

  constructor(config: any, fieldsConfig: FieldsConfiguration) {
    this.onChange = new EventEmitter();

    this._config = config;
    this._fieldsConfig = fieldsConfig;

    this.setValues(config.values);
    this.value = config.value;
  }

  get dependencies(): Array<any> {
    return this._config.dependencies || [];
  }

  get name(): string {
    return this._config.name;
  }

  get label(): string {
    return this._config.label;
  }

  get values(): string[] {
    return this._filteredValues;
  }

  get value(): string {
    const values = this.values;
    return values.includes(this._value) ? this._value : values[0];
  }

  set value(value: string) {
    this._value = value;
    this.onChange.emit(value);
  }

  get isCheckbox(): boolean {
    return this._isCheckbox;
  }

  get isAvailable(): boolean {
    return !!this.values.length;
  }

  private isValueAvailable(fieldsConfig: FieldsConfiguration, condition: string) {
    return condition ? eval(condition) : true;
  }

  filterValues() {
    this._filteredValues = this._values
      .filter(value => value.isAvailable())
      .map(value => value.value);

    this._isCheckbox = this.values.includes('yes') || this.values.includes('no');
  }

  setValues(values: Array<any>) {
    const deps = this.dependencies.map(dependency => ({
      value: dependency,
      regex: new RegExp(dependency, 'g')
    }));

    this._values = values.map(fieldValue => {
      let condition = fieldValue.condition || '';

      deps.forEach((dependency) => {
        condition = condition.replace(dependency.regex, `fieldsConfig.getFieldSafeValue('${dependency.value}')`);
      });

      return {
        value: fieldValue.value,
        isAvailable: this.isValueAvailable.bind(null, this._fieldsConfig, condition)
      }
    });

    this.filterValues();
  }
}
