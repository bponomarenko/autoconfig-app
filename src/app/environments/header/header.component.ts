import { Component, ViewChild } from '@angular/core';

import { ModalComponent} from '../../shared/modal/modal.component';
import { CreateFormComponent } from '../create-form/create-form.component';
import { User } from '../../types';
import { ConfigurationService, EnvironmentsService, NotificationsService } from '../../services';

@Component({
  selector: 'ac-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private createFormData: any;
  private createErrorId: number;
  private environmentConfiguration: any;
  private configurationName: any;

  @ViewChild('createDialog') createDialog: ModalComponent;
  @ViewChild('createForm') createForm: CreateFormComponent;

  constructor(
    private confService: ConfigurationService,
    private envService: EnvironmentsService,
    private alerts: NotificationsService) {

    this.createFormData = {};
  }

  ngAfterContentInit() {
    this.createDialog.onShow.subscribe(() => {
      this.createFormData = Object.assign({}, this.environmentConfiguration);
    });

    this.createDialog.onHidden.subscribe(() => {
      if(this.createForm) {
        this.createForm.reset();
      }
      this.dismissCreateError();
      this.environmentConfiguration = this.configurationName = null;
    });
  }

  get loading(): boolean {
    return this.envService.loadingEnvironments;
  }

  get creating(): boolean {
    return this.envService.creatingEnvironment;
  }

  get provisionConfigNames(): string[] {
    return Object.keys(this.confService.provisionConfigurations);
  }

  reloadEnvironments() {
    this.envService.loadEnvironments();
  }

  createEnvironment(user: User, data: any): Promise<null> {
    this.dismissCreateError();

    const stack = data.stack;
    delete data.stack;

    // Use only async provisioning
    data.async = 'yes';

    return this.envService.createEnvironment({user, stack, data})
      .then(res => {
        this.createDialog.hide();
        this.alerts.addSuccess(`${res.message} New environment name – ${res.environment_name}`);
        return res.environment_name;
      })
      .catch(error => {
        this.createErrorId = this.alerts.addError(`Unable to provision new environment. ${error.message || error}`);
      })
      .then((name: string) => {
        if(!this.createErrorId) {
          return this.loadNewEnvironment(name)
        }
      });
  }

  createConfiguredEnvironment() {
    this.environmentConfiguration = Object.assign({}, this.confService.provisionConfigurations[this.configurationName]);
    this.createDialog.show();
  }

  private loadNewEnvironment(name: string) {
    return this.envService.loadEnvironment(name)
      .then(() => {
        // TODO: scroll to new element and select it
      })
      .catch(error => {
        this.alerts.addError(`Unable to load new environment ${name}. ${error.message || error}`);
      });
  }

  private dismissCreateError() {
    if (this.createErrorId) {
      this.alerts.dismiss(this.createErrorId);
      this.createErrorId = null;
    }
  }
}
