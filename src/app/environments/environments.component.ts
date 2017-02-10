import { Component, AfterContentInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Subscription } from 'rxjs/Rx';

import { Environment } from '../types/environment';
import { User } from '../types/user';
import { EnvironmentsService } from '../services/environments.service';
import { UserService } from '../services/user.service';
import { NotificationsService } from '../services/notifications.service';
import { CredentialsFormComponent } from '../credentials-form/credentials-form.component';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements AfterContentInit, OnDestroy {
  private environmentToDelete: string;
  private deleting: boolean = false;
  private isDeleteFormShown: boolean = false;
  private isDeleteFormValid: boolean = false;
  private deleteErrorId: number;
  private formData: { user: User, save: boolean };
  private user: User;
  private userChangeSubscription: Subscription;

  @Input() environments: Environment[];
  @Output() onDelete: EventEmitter<string>;
  @ViewChild('deleteModal') deleteModal: ModalDirective;
  @ViewChild('deleteForm') deleteForm: CredentialsFormComponent;

  constructor(private envService: EnvironmentsService, private userService: UserService, private notifications: NotificationsService) {
    this.user = this.userService.getUser();
    this.onDelete = new EventEmitter<string>();

    this.userChangeSubscription = this.userService.onUserChange.subscribe((user: User) => {
      this.user = new User(user);
    });
  }

  ngAfterContentInit() {
    this.deleteModal.onHidden.subscribe(() => {
      if(this.deleteForm) {
        this.deleteForm.reset();
      }
      this.isDeleteFormShown = false;
      this._dismissDeleteError();
    });
  }

  ngOnDestroy() {
    this.userChangeSubscription.unsubscribe();
  }

  showDeleteConfirmation(name: string) {
    this.environmentToDelete = name;
    this.deleteModal.show();
  }

  deleteEnvironmentAndSaveUser() {
    this._deleteEnvironment(this.formData.user)
      .then(() => {
        if(!this.deleteErrorId && this.formData.save) {
          this.userService.setUser(this.formData.user);
        }
      });
  }

  deleteEnvironment() {
    if(!this.user || !this.user.hasAllData()) {
      this.showDeleteForm();
    } else {
      this._deleteEnvironment(this.user);
    }
  }

  showDeleteForm() {
    this.formData = {
      user: new User(this.user),
      save: false
    }
    this.isDeleteFormShown = true;
  }

  private _deleteEnvironment(user: User) {
    const envName: string = this.environmentToDelete;

    this._dismissDeleteError();

    const envToDelete = this.environments.find(env => env.name === envName);
    // Fail delete action if user is not an owner of environment
    if(envToDelete && envToDelete.owner.email !== user.email) {
      this.deleteErrorId = this.notifications.addError(`You are not an owner of ${envName} environment and those you are not allowed to delete it.`);
      return;
    }

    this.deleting = true;
    // Disable dialog dismissal by keyboard
    this.deleteModal.config.keyboard = false;

    return this.envService.remove({
        environmentName: envName,
        username: user.email,
        password: user.password
      })
      .then(() => {
        this.notifications.addSuccess(`Environment ${envName} have been successfuly deleted.`);
        this.onDelete.emit(envName);
        this.deleteModal.hide();
      })
      .catch(error => {
        this.deleteErrorId = this.notifications.addError(`Unable to delete environment ${envName}. ${error.message || error}`);
      })
      .then(() => {
        this.deleting = false;
        // Restore dialog dismissal by keyboard
        this.deleteModal.config.keyboard = true;
      });
  }

  private _dismissDeleteError() {
    if (this.deleteErrorId) {
      this.notifications.dismiss(this.deleteErrorId);
      this.deleteErrorId = null;
    }
  }
}
