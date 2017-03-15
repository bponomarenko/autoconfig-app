import { Injectable, EventEmitter } from '@angular/core';

import { Environment } from '../types';

export const availableFilters: Array<{ field: string }> = [
  { field: 'owner.email' }
];

@Injectable()
export class FilteringService {
  private filters: Array<{ field: string, value: string }> = []
  onChange: EventEmitter<void>;

  constructor() {
    this.onChange = new EventEmitter<void>();
  }

  get active(): boolean {
    return !!this.filters.length;
  }

  process(environments: Environment[]): Environment[] {
    return environments.filter(env =>
      this.filters.every(filter =>
        this.getValue(env, filter.field) === filter.value)
    );
  }

  clear() {
    this.filters = [];
    this.onChange.emit();
  }

  addFilter(field: string, value: string) {
    if(field && value && availableFilters.find(filter => filter.field === field)) {
      this.filters.push({field, value});
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
