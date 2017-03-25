import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs/Rx';

import { CredentialsModalComponent } from "app/shared/credentials-modal/credentials-modal.component";
import { EnvironmentsService, NotificationsService } from "app/services";
import { FilteringService } from "./filtering.service";
import { User, Environment } from '../types';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements AfterContentInit {
  private _environments: Environment[];
  private selectedEnvironment: string;
  private selectedEnvironmentTTL: string;
  private deleteErrorId: number;
  private updateErrorId: number;
  private inProgress: boolean = false;
  private changeEnvSubscription: Subscription;
  private changeFilterSubscription: Subscription;

  @ViewChild('deleteDialog') deleteDialog: CredentialsModalComponent;
  @ViewChild('ttlDialog') ttlDialog: CredentialsModalComponent;
  @ViewChild('ttlForm') ttlForm: NgForm;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private filtering: FilteringService) {
    this.changeEnvSubscription = this.envService.onChange.subscribe(() => this.processEnvironments());
    this.changeFilterSubscription = this.filtering.onChange.subscribe(() => this.processEnvironments());
    this.processEnvironments();
  }

  ngAfterContentInit() {
    this.deleteDialog.onHidden.subscribe(() => {
      this.dismissDeleteError();
      this.selectedEnvironment = null;
    });

    this.ttlDialog.onHidden.subscribe(() => {
      this.dismissUpdateError();
      this.selectedEnvironment = this.selectedEnvironmentTTL = null;

      this.ttlForm.reset();
    });
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

  private showTTLDialog(name: string) {
    this.selectedEnvironment = name;
    this.selectedEnvironmentTTL = this._environments.find(env => env.name === name).config.ttl;
    this.ttlDialog.show();
  }

  private showDeleteConfirmation(name: string) {
    this.selectedEnvironment = name;
    this.deleteDialog.show();
  }

  private deleteEnvironment(user: User): Promise<null> {
    if(this.inProgress) {
      return null;
    }

    this.dismissDeleteError();

    const environmentName = this.selectedEnvironment;
    this.inProgress = true;

    return this.envService.deleteEnvironment({ user, environmentName })
      .then(() => {
        this.alerts.addSuccess(`Environment ${environmentName} have been successfuly deleted.`);
        this.deleteDialog.hide();
        this.inProgress = false;
      })
      .catch(error => {
        this.deleteErrorId = this.alerts.addError(`Unable to delete environment ${environmentName}. ${error.message || error}`);
        this.inProgress = false;
      });
  }

  private updateEnvironment(user: User, ttl: string): Promise<null> {
    if(this.inProgress) {
      return null;
    }

    this.dismissUpdateError();

    const environmentName = this.selectedEnvironment;
    this.inProgress = true;

    return this.envService.updateEnvironment({ user, environmentName, ttl })
      .then(() => {
        this.alerts.addSuccess(`TTL for environment ${environmentName} have been successfuly changed to ${ttl}.`);
        this.ttlDialog.hide();
        this.inProgress = false;
      })
      .catch(error => {
        this.updateErrorId = this.alerts.addError(`Unable to change TTL for environment ${environmentName}. ${error.message || error}`);
        this.inProgress = false;
        return Promise.reject(error);
      })
      .then(() => this.envService.loadEnvironment(environmentName));
  }

  private dismissDeleteError() {
    if (this.deleteErrorId) {
      this.alerts.dismiss(this.deleteErrorId);
      this.deleteErrorId = null;
    }
  }

  private dismissUpdateError() {
    if (this.updateErrorId) {
      this.alerts.dismiss(this.updateErrorId);
      this.updateErrorId = null;
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
