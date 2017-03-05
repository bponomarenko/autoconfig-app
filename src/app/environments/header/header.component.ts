import { Component, ViewChild } from '@angular/core';

import { ModalComponent} from '../../shared/modal/modal.component';
import { CreateFormComponent } from '../create-form/create-form.component';
import { User } from '../../types';
import { ConfigurationService, EnvironmentsService, NotificationsService } from '../../services';

const DEFAULT_FORM_DATA = {
  stack: '',
  version: 'latest',
  ttl: '4h',
  async: true
};

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
      this.createFormData = Object.assign(DEFAULT_FORM_DATA, this.environmentConfiguration);
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

  createEnvironment(user: User): Promise<null> {
    this.dismissCreateError();

    const data = Object.assign({}, this.createFormData);
    delete data.stack;

    return this.envService.createEnvironment({
      user,
      stack: this.createFormData.stack,
      data: this.getNewEnvironmentData(data)
    })
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

  private getNewEnvironmentData(formData: any): any {
    return Object.keys(formData)
      .reduce((result, key: string) => {
        const value = formData[key];
        result[key] = typeof value === 'boolean' ? this.getYesNo(value) : value;
        return result;
      }, {});
  }

  private getYesNo(value: boolean): string {
    return value ? 'yes' : 'no';
  }
}
