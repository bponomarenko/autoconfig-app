import { Injectable, EventEmitter } from '@angular/core';

import { Environment } from '../types';
import { StatusPipe } from './pipes/status.pipe';

@Injectable()
export class FilteringService {
  private filters: Array<{ field: string, values: string[] }> = [];

  availableFilters: Array<any> = [];
  onChange: EventEmitter<void>;

  constructor(private statusPipe: StatusPipe) {
    this.onChange = new EventEmitter<void>();
    this.availableFilters = [
      { field: 'owner.email', name: 'Owner', label: value => value.split('@')[0] },
      { field: 'stack', name: 'Stack', label: value => value },
      { field: 'config.version', name: 'Version', label: value => value },
      { field: 'status', name: 'Status', label: this.statusPipe.transform },
      { field: 'config.server', name: 'Server', label: value => value },
      { field: 'config.db', name: 'DB', label: value => value }
    ];
  }

  get active(): boolean {
    return !!this.filters.length;
  }

  process(environments: Environment[]): Environment[] {
    return environments.filter(env =>
      this.filters.every(filter =>
        filter.values.includes(this.getValue(env, filter.field))
      )
    );
  }

  clear() {
    this.filters = [];
    this.onChange.emit();
  }

  clearFieldFilters(field: string) {
    const index = this.filters.findIndex(filter => filter.field === field);
    if(index !== -1) {
      this.filters.splice(index, 1);
      this.onChange.emit();
    }
  }

  addFilter(field: string, value: string) {
    if(this.availableFilters.find(filter => filter.field === field)) {
      let filter = this.filters.find(filter => filter.field === field);
      if(!filter) {
        filter = { field, values: [value] };
        this.filters.push(filter);
        this.onChange.emit();
      } else if(!filter.values.includes(value)) {
        filter.values.push(value);
        this.onChange.emit();
      }
    }
  }

  getValue(obj: any, field: string): any {
    if(!obj) {
      return null;
    }

    const partials = field.split('.');
    return partials.length > 1 ? this.getValue(obj[partials.shift()], partials.join('.')) : obj[field];
  }

  getFieldFilterValues(field: string): string[] {
    const filter = this.filters.find(filter => filter.field === field);
    return filter ? filter.values : [];
  }
}
