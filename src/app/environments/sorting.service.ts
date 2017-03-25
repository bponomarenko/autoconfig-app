import { Injectable, EventEmitter } from '@angular/core';

import { Environment } from "app/types";

type SortConfig = {
  field: string;
  name: string;
  fn: (ascending: boolean) => (val1: any, val2: any) => number;
};

const compareStr = (ascending: boolean) => (val1: string, val2: string) => {
  return val1.localeCompare(val2) * (ascending ? 1 : -1);
}

@Injectable()
export class SortingService {
  private _ascending: boolean = true;
  private _sortConfig: any;

  onChange: EventEmitter<void>;
  availableSortConfigs: Array<SortConfig> = [
    { field: 'expire_at', name: 'Expiriation date', fn: compareStr }
  ];
  
  constructor() {
    this.onChange = new EventEmitter<void>();
  }
  
  get active(): boolean {
    return !!this._sortConfig;
  }

  get ascending(): boolean {
    return this._ascending;
  }

  set ascending(value: boolean) {
    if(this._ascending !== !!value) {
      this._ascending = !!value;
      this.onChange.emit();
    }
  }

  get sortField(): string {
    return this._sortConfig ? this._sortConfig.field : null;
  }

  set sortField(value: string) {
    let config;
    if(this.sortField !== value && (config = this.availableSortConfigs.find(fn => fn.field === value))) {
      this._sortConfig = config;
      this.onChange.emit();
    }
  }
  
  process(environments: Environment[]): Environment[] { 
    if(environments && this._sortConfig) {
      return environments.sort((env1: Environment, env2: Environment) => {
        const val1 = this.getValue(env1, this._sortConfig.field);
        const val2 = this.getValue(env2, this._sortConfig.field);
        return this._sortConfig.fn(this.ascending)(val1, val2);
      });
    } else {
      return environments;
    }
  }

  clear() {
    if(this._sortConfig) {
      this._sortConfig = null;
      this.onChange.emit();
    }
  }

  private getValue(obj: any, field: string): any {
    if(!obj) {
      return null;
    }

    const partials = field.split('.');
    return partials.length > 1 ? this.getValue(obj[partials.shift()], partials.join('.')) : obj[field];
  }
}
