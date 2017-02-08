import {
  Component,
  AfterContentInit,
  ViewChild
} from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { NgForm } from '@angular/forms';

import { User } from '../types/user';
import { UserService } from '../services/user.service';
import { EnvironmentsService } from '../services/environments.service';
import { NotificationsService } from '../services/notifications.service';
import { CredentialsFormComponent } from '../credentials-form/credentials-form.component';

interface ProvisionFormData {
  stack?: string;
  async?: boolean;
}

@Component({
  selector: 'ac-provision-dialog',
  templateUrl: './provision-dialog.component.html',
  styleUrls: ['./provision-dialog.component.css']
})
export class ProvisionDialogComponent implements AfterContentInit {
  private provisioning: boolean = false;
  private loadingStacks: boolean = false;
  private isFormShown: boolean = false;
  private isFormValid: boolean;
  private user: User;
  private formData: { user: User, save: boolean };
  private provisionData: ProvisionFormData = {};
  private stacks: string[];
  private provisionErrorId: number;

  @ViewChild('provisionModal') dialog: ModalDirective;
  @ViewChild('userForm') userForm: CredentialsFormComponent;
  @ViewChild('provisionForm') provisionForm: NgForm;

  constructor(
    private userService: UserService,
    private envService: EnvironmentsService,
    private notifications: NotificationsService) {
    this.user = this.userService.getUser();

    this.userService.userChange.subscribe((user: User) => {
      this.user = new User(user);
    });
  }

  ngAfterContentInit() {
    this.dialog.onShown.subscribe(() => {
      if(!this.stacks && !this.loadingStacks) {
        this._loadStacks();
      }
    });

    this.dialog.onHidden.subscribe(() => {
      if(this.userForm) {
        this.userForm.reset();
      }

      if(this.provisionForm) {
        this.provisionForm.resetForm();
      }

      this.isFormShown = false;
      this._dismissCreateError();
    });
  }

  get isProvisionDisabled(): boolean {
    return (this.isFormShown && !this.isFormValid) ||
      (this.provisionForm && !this.provisionForm.valid) ||
      this.provisioning;
  }

  show() {
    this.provisionData = {
      async: true
    };
    this._selectFirstStack();
    this.dialog.show();
  }

  showForm() {
    this.formData = {
      user: new User(this.user),
      save: false
    };
    this.isFormShown = true;
  }

  provisionEnvironment() {
    if(!this.user || !this.user.hasAllData()) {
      this.showForm();
    } else {
      this._provisionEnvironment(this.user);
    }
  }

  provisionEnvironmentAndSaveUser() {
    this._provisionEnvironment(this.formData.user)
      .then(() => {
        if(!this.provisionErrorId && this.formData.save) {
          this.userService.setUser(this.formData.user);
        }
      });
  }

  private _provisionEnvironment(user: User): Promise<null> {
    if(this.provisioning) {
      return Promise.resolve();
    }

    this.provisioning = true;
    this._dismissCreateError();

    return this.envService.create({
        stackName: this.provisionData.stack,
        username: user.email,
        password: user.password,
        data: {
          async: this.provisionData.async
        }
      })
      .then(() => {
        // this.notifications.addSuccess(``)
        this.provisioning = false;
      })
      .catch(error => {
        this.provisionErrorId = this.notifications.addError(`Unable to provision new environment. ${error.message}`);
        this.provisioning = false;
      });
  }

  private _loadStacks() {
    if(this.loadingStacks) {
      return;
    }

    this.loadingStacks = true;

    this.envService.getStacks()
      .then((data: string[]) => {
        this.stacks = data.splice(0);
        this._selectFirstStack();
      })
      .catch(error => {
        const id = this.notifications.addError(`Unable to load environment stacks. ${error.message}`);
      })
      .then(() => {
        this.loadingStacks = false;
      });
  }

  private _dismissCreateError() {
    if(this.provisionErrorId) {
      this.notifications.dismiss(this.provisionErrorId);
      this.provisionErrorId = null;
    }
  }

  private _selectFirstStack() {
    if(this.provisionData) {
      this.provisionData.stack = (this.stacks && this.stacks[0]) || '';
    }
  }
}
