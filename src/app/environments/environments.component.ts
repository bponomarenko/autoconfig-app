import {
  Component,
  AfterContentInit,
  Input,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';

import { Environment } from '../types/environment';
import { User } from '../types/user';
import { EnvironmentsService } from '../services/environments.service';
import { UserService } from '../services/user.service';
import { NotificationsService } from '../services/notifications.service';
import { CredentialsFormComponent } from '../credentials-form/credentials-form.component';

@Component({
  selector: 'ac-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.css']
})
export class EnvironmentsComponent implements AfterContentInit {
  private environmentToDelete: string;
  private deleting: boolean = false;
  private isDeleteFormShown: boolean = false;
  private isDeleteFormValid: boolean = false;
  private deleteErrorId: number;
  private formData: { user: User, save: boolean };
  private user: User;

  @Input() environments: Environment[] = [];
  @ViewChild('deleteModal') deleteModal: ModalDirective;
  @ViewChild('deleteForm') deleteForm: CredentialsFormComponent;

  constructor(
    private envService: EnvironmentsService,
    private userService: UserService,
    private notifications: NotificationsService) {
    this.user = this.userService.getUser();

    this.userService.userChange.subscribe((user: User) => {
      this.user = new User(user);
    });
  }

  ngAfterContentInit() {
    this.deleteModal.onHidden.subscribe(() => {
      if(this.deleteForm) {
        this.deleteForm.reset();
      }
      this.isDeleteFormShown = false;
    });
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

    this.deleting = true;
    // Disable dialog dismissal by keyboard
    this.deleteModal.config.keyboard = false;

    if (this.deleteErrorId) {
      this.notifications.dismiss(this.deleteErrorId);
      this.deleteErrorId = null;
    }

    return this.envService.remove({
        environmentName: envName,
        username: user.email,
        password: user.password
      })
      .then(() => {
        this.notifications.addSuccess(`Environment ${envName} have been successfuly deleted.`);
        // TODO: Removed deleted environment from internal collection
        this.deleteModal.hide();
      })
      .catch(error => {
        this.deleteErrorId = this.notifications.addError(`Unable to delete environment ${envName}. ${error.message || error}`);
      })
      .then(() => {
        this.deleting = false;
        // Restore dialog dismissal by keyboard
        this.deleteModal.config.keyboard = false;
      });
  }
}
