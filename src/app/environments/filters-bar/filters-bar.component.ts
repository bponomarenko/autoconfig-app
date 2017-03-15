import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { FilteringService } from '../filtering.service';
import { EnvironmentsService } from '../../services';
import { Environment } from '../../types';

@Component({
  selector: 'ac-filters-bar',
  templateUrl: './filters-bar.component.html',
  styles: [`
    .dropdown-item.selected {
      background-color: #fafafa;
      text-decoration: none;
    }
  `]
})
export class FiltersBarComponent implements OnInit, OnDestroy {
  private changeEnvSubscription: Subscription;
  private _filters;

  constructor(private filtering: FilteringService, private envService: EnvironmentsService) {}

  ngOnInit() {
    this.changeEnvSubscription = this.envService.onChange.subscribe(envs => this.grabFiltersValues(envs));

    this._filters = this.filtering.availableFilters.slice()
      .map(filter => Object.assign({ values: [] }, filter));
    this.grabFiltersValues(this.envService.environments);
  }

  ngOnDestroy() {
    if(this.changeEnvSubscription) {
      this.changeEnvSubscription.unsubscribe();
      this.changeEnvSubscription = null;
    }
  }

  private get filters(): Array<any> {
    return this._filters;
  }

  private clearFieldFilters(field: string) {
    this.filtering.clearFieldFilters(field);
  }

  private addFilter(field: string, value: string) {
    this.filtering.addFilter(field, value);
  }

  private grabFiltersValues(envs: Environment[]) {
    this._filters.forEach(filter => {
      const values = [];
      (envs || []).forEach(env => {
        const value = this.filtering.getValue(env, filter.field);
        if(value && !values.includes(value)) {
          values.push(value);
        }
      });
      filter.values = values.sort();
    });
  }

  private getFilterValues(filter: string): string[] {
    return this.filtering.getFieldFilterValues(filter);
  }

  private getFilterValuesCount(filter: string): number {
    return this.getFilterValues(filter).length;
  }
}
