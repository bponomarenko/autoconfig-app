import { EventEmitter } from '@angular/core';

import { FieldsConfiguration } from './fields-configuration';

export class FieldConfiguration {
  private _config: any;
  private _fieldsConfig: FieldsConfiguration;
  private _values: Array<any>;
  private _filteredValues: Array<string> = [];
  private _value: string;
  private _isCheckbox: boolean;
  private _textCondition: any;
  private _isAvailable: boolean = true;

  onChange: EventEmitter<void>;

  constructor(config: any, fieldsConfig: FieldsConfiguration) {
    this.onChange = new EventEmitter<void>();

    this._config = config;
    this._fieldsConfig = fieldsConfig;

    if(this.isText) {
      this.setTextCondition();
      this.updateProperties();
    } else {
      this.setValues(config.values);
    }
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
    return this.isText || values.includes(this._value) ? this._value : values[0];
  }

  set value(value: string) {
    this._value = value;
    this.onChange.emit();
  }

  get isText(): boolean {
    return !!this._config.text;
  }

  get isCheckbox(): boolean {
    return this._isCheckbox;
  }

  get isAvailable(): boolean {
    return this.isText ? this._isAvailable : !!this.values.length;
  }

  get isEnabled(): boolean {
    return this.isText ? true: this.values.length > 1;
  }

  private isValueAvailable(fieldsConfig: FieldsConfiguration, condition: string) {
    return condition ? eval(condition) : true;
  }

  private filterValues() {
    this._filteredValues = this._values
      .filter(value => value.isAvailable())
      .map(value => value.value);

    const length = this._filteredValues.length;
    this._isCheckbox = !this.isText &&
      (length === 1 || length === 2) &&
      (this._filteredValues.includes('yes') || this._filteredValues.includes('no'));
  }

  updateProperties() {
    if(this.isText) {
      this._isAvailable = this.isValueAvailable(this._fieldsConfig, this._textCondition);
    } else {
      this.filterValues();
    }
    this.onChange.emit();
  }

  setValues(values: Array<any>) {
    this._values = values.map(fieldValue => {
      const condition = this.transformCondition(fieldValue.condition || '', this.getDependencies());
      return {
        value: fieldValue.value,
        isAvailable: this.isValueAvailable.bind(null, this._fieldsConfig, condition)
      }
    });

    this.filterValues();
    this.onChange.emit();
  }

  private getDependencies() {
    return this.dependencies.map(dependency => ({
      value: dependency,
      regex: new RegExp(`{${dependency}}`, 'g')
    }));
  }

  private transformCondition(condition: string, dependencies: Array<any>): string {
    dependencies.forEach((dependency) => {
      condition = condition.replace(dependency.regex, `fieldsConfig.getFieldSafeValue('${dependency.value}')`);
    });
    return condition;
  }

  private setTextCondition() {
    this._textCondition = this.transformCondition(this._config.condition || '', this.getDependencies());
  }
}
