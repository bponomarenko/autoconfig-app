import { Component, ViewChild } from '@angular/core';
import { ModalComponent, UserFormComponent, CreateFormComponent } from '..';
import { User, UserFormData, CreateEnvironmentFormData } from '../../types';
import { UserService, EnvironmentsService, NotificationsService } from '../../services';

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

  constructor(private userService: UserService, private envService: EnvironmentsService, private alerts: NotificationsService) {
    this.userFormData = { user: new User() };
    this.createFormData = { stack: '' };
  }

  ngAfterContentInit() {
    this.userDialog.onShow.subscribe(() => {
      this.userFormData.user = new User(this.user);
    });

    this.createDialog.onShow.subscribe(() => {
      this.createFormData = { stack: '', async: true };
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
    return this.userService.user;
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
    this.userService.user = this.userFormData.user;
    this.userDialog.hide();
  }

  reloadEnvironments() {
    this.envService.loadEnvironments();
  }

  createEnvironment(user: User): Promise<null> {
    this._dismissCreateError();

    return this.envService.createEnvironment({
      user,
      data: Object.assign({}, this.createFormData)
    })
      .then(res => {
        this.alerts.addSuccess(`${res.message} New environment name – ${res.environment_name}`);
        this.createDialog.hide();
      })
      .catch(error => {
        this.createErrorId = this.alerts.addError(`Unable to provision new environment. ${error.message || error}`);
      });
  }

  private _dismissCreateError() {
    if (this.createErrorId) {
      this.alerts.dismiss(this.createErrorId);
      this.createErrorId = null;
    }
  }
}
