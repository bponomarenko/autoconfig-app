import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { EnvironmentsService, NotificationsService } from '../../services';
import { User, Environment } from '../../types';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements AfterContentInit {
  private environmentNameToDelete: string;
  private deleteErrorId: number;

  @ViewChild('deleteDialog') deleteDialog;

  constructor(private envService: EnvironmentsService, private alerts: NotificationsService) {}

  ngAfterContentInit() {
    this.deleteDialog.onHidden.subscribe(() => this._dismissDeleteError());
  }

  get environments(): Environment[] {
    return this.envService.environments;
  }

  get deleting(): boolean {
    return this.envService.deletingEnvironment;
  }

  showDeleteConfirmation(name: string) {
    this.environmentNameToDelete = name;
    this.deleteDialog.show();
  }

  deleteEnvironment(user: User): Promise<null> {
    this._dismissDeleteError();

    const environmentName = this.environmentNameToDelete;
    const envToDelete = this.environments.find(env => env.name === environmentName);
    // Fail delete action if user is not an owner of environment
    if(envToDelete && envToDelete.owner.email !== user.email) {
      this.deleteErrorId = this.alerts.addError(`You are not an owner of ${environmentName} environment and those you are not allowed to delete it.`);
      return null;
    }

    return this.envService.deleteEnvironment({ user, environmentName })
      .then(() => {
        this.alerts.addSuccess(`Environment ${environmentName} have been successfuly deleted.`);
        this.deleteDialog.hide();
      })
      .catch(error => {
        this.deleteErrorId = this.alerts.addError(`Unable to delete environment ${environmentName}. ${error.message || error}`);
      });
  }

  private _dismissDeleteError() {
    if (this.deleteErrorId) {
      this.alerts.dismiss(this.deleteErrorId);
      this.deleteErrorId = null;
    }
  }
}
