import { Component, ViewChild } from '@angular/core';
import { ModalComponent, UserFormComponent, CreateFormComponent } from '..';
import { User, UserFormData } from '../../types';
import { ConfigurationService, EnvironmentsService, NotificationsService } from '../../services';

@Component({
  selector: 'ac-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private userFormData: UserFormData;
  private createFormData: any;
  private createErrorId: number;

  @ViewChild('credentialsDialog') userDialog: ModalComponent;
  @ViewChild('createDialog') createDialog: ModalComponent;
  @ViewChild('credentialsForm') userForm: UserFormComponent;
  @ViewChild('createForm') createForm: CreateFormComponent;

  constructor(private confService: ConfigurationService, private envService: EnvironmentsService, private alerts: NotificationsService) {
    this.userFormData = { user: new User() };
    this.createFormData = {};
  }

  ngAfterContentInit() {
    this.userDialog.onShow.subscribe(() => {
      this.userFormData.user = new User(this.user);
    });

    this.createDialog.onShow.subscribe(() => {
      this.createFormData = {
        stack: '',
        version: 'latest',
        ttl: '4h',
        async: true
      };
    });

    this.userDialog.onHidden.subscribe(() => {
      this.userForm.reset();
    });

    this.createDialog.onHidden.subscribe(() => {
      if(this.createForm) {
        this.createForm.reset();
      }
      this._dismissCreateError();
    });
  }

  get user(): User {
    return this.confService.user;
  }

  get isUserModified(): boolean {
    return !this.user.isEqualTo(this.userFormData.user);
  }

  get loading(): boolean {
    return this.envService.loadingEnvironments;
  }

  get creating(): boolean {
    return this.envService.creatingEnvironment;
  }

  saveUserCredentials() {
    this.confService.user = this.userFormData.user;
    this.userDialog.hide();
  }

  reloadEnvironments() {
    this.envService.loadEnvironments();
  }

  createEnvironment(user: User): Promise<null> {
    this._dismissCreateError();

    const data = Object.assign({}, this.createFormData);
    delete data.stack;

    return this.envService.createEnvironment({
      user,
      stack: this.createFormData.stack,
      data: this._getNewEnvironmentData(data)
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
          return this._loadNewEnvironment(name)
        }
      });
  }

  private _loadNewEnvironment(name: string) {
    return this.envService.loadEnvironment(name)
      .then(() => {
        // TODO: scroll to new element and select it
      })
      .catch(error => {
        this.alerts.addError(`Unable to load new environment ${name}. ${error.message || error}`);
      });
  }

  private _dismissCreateError() {
    if (this.createErrorId) {
      this.alerts.dismiss(this.createErrorId);
      this.createErrorId = null;
    }
  }

  private _getNewEnvironmentData(formData: any): any {
    return Object.keys(formData)
      .reduce((result, key: string) => {
        const value = formData[key];
        result[key] = typeof value === 'boolean' ? this._getYesNo(value) : value;
        return result;
      }, {});
  }

  private _getYesNo(value: boolean): string {
    return value ? 'yes' : 'no';
  }
}
