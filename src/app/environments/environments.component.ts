import { Component, ViewChild, AfterContentInit } from '@angular/core';

import { EnvironmentsService, NotificationsService, ConfigurationService } from '../services';
import { User, Environment } from '../types';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements AfterContentInit {
  private environmentNameToDelete: string;
  private deleteErrorId: number;
  private deleting: boolean = false;

  @ViewChild('deleteDialog') deleteDialog;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private configuration: ConfigurationService) {}

  ngAfterContentInit() {
    this.deleteDialog.onHidden.subscribe(() => this.dismissDeleteError());
  }

  private get environments(): Environment[] {
    return this.envService.environments;
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
}
