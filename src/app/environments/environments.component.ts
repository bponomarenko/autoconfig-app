import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { EnvironmentsService, NotificationsService, ConfigurationService } from '../services';
import { FilteringService } from './filtering.service';
import { User, Environment } from '../types';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements AfterContentInit {
  private _environments: Environment[];
  private environmentNameToDelete: string;
  private deleteErrorId: number;
  private deleting: boolean = false;
  private changeEnvSubscription: Subscription;
  private changeFilterSubscription: Subscription;

  @ViewChild('deleteDialog') deleteDialog;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private configuration: ConfigurationService,
    private filtering: FilteringService) {
    this.changeEnvSubscription = this.envService.onChange.subscribe(() => this.processEnvironments());
    this.changeFilterSubscription = this.filtering.onChange.subscribe(() => this.processEnvironments());
    this.processEnvironments();
  }

  ngAfterContentInit() {
    this.deleteDialog.onHidden.subscribe(() => this.dismissDeleteError());
  }

  ngOnDestroy() {
    if(this.changeEnvSubscription) {
      this.changeEnvSubscription.unsubscribe();
      this.changeEnvSubscription = null;
    }

    if(this.changeFilterSubscription) {
      this.changeFilterSubscription.unsubscribe();
      this.changeFilterSubscription = null;
    }
  }

  private get environments(): Environment[] {
    return this._environments;
  }

  private get loading(): boolean {
    return this.envService.loadingEnvironments;
  }

  private get urls() {
    return this.configuration.navigationUrls;
  }

  showDeleteConfirmation(name: string) {
    this.environmentNameToDelete = name;
    this.deleteDialog.show();
  }

  deleteEnvironment(user: User): Promise<null> {
    if(this.deleting) {
      return null;
    }

    this.dismissDeleteError();

    const environmentName = this.environmentNameToDelete;
    this.deleting = true;

    return this.envService.deleteEnvironment({ user, environmentName })
      .then(() => {
        this.alerts.addSuccess(`Environment ${environmentName} have been successfuly deleted.`);
        this.deleteDialog.hide();
        this.deleting = false;
      })
      .catch(error => {
        this.deleteErrorId = this.alerts.addError(`Unable to delete environment ${environmentName}. ${error.message || error}`);
        this.deleting = false;
      });
  }

  private dismissDeleteError() {
    if (this.deleteErrorId) {
      this.alerts.dismiss(this.deleteErrorId);
      this.deleteErrorId = null;
    }
  }

  private processEnvironments() {
    let envs = this.envService.environments;

    if(this.filtering.active) {
      envs = this.filtering.process(envs);
    }

    this._environments = envs;
  }
}
