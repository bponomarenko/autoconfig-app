import { Component, AfterContentInit, ViewChild, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { ModalComponent } from '../modal/modal.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { User, UserFormData } from '../../types';
import { ConfigurationService } from '../../services';

@Component({
  selector: 'ac-credentials-modal',
  templateUrl: './credentials-modal.component.html'
})
export class CredentialsModalComponent extends ModalComponent implements AfterContentInit, OnChanges {
  private isFormShown: boolean = false;
  private isFormValid: boolean = false;
  private formData: UserFormData;

  private formChangeSubscription: Subscription;
  @ViewChild('userForm') userForm: UserFormComponent;

  constructor(private confService: ConfigurationService) {
    super();
    this.formData = { user: new User() };
  }

  ngAfterContentInit() {
    this.modal.onHidden.subscribe(() => {
      // Reset and hide form when dialog is hidden
      if(this.userForm) {
        this.userForm.reset();
      }
      this.hideForm();
    });
  }

  ngOnChanges(changes: any) {
    // Since #userForm is used with combination of *ngIf directive,
    // this.userForm property will not always will be set to form instance.
    // Thus, we have to check for form instance presence in order to subscribe to "isValid" status changes.
    if(this.userForm && !this.formChangeSubscription) {
      this.isFormValid = this.userForm.isValid;

      this.formChangeSubscription = this.userForm.isValidChange.subscribe((valid: boolean) => {
        this.isFormValid = valid;
      });
    } else if (!this.userForm && this.formChangeSubscription) {
      // When form instance destroyed, unsbuscribe formChanges subscription and invalidate the form
      this.formChangeSubscription.unsubscribe();
      this.formChangeSubscription = null;
      this.isFormValid = false;
    }
  }

  get isActionBtnDisabled() {
    return this.inProgress || (this.isFormShown ? !this.isFormValid : this.actionBtnDisabled);
  }

  private tryToDoAction() {
    // Try to save with user or show user form
    const user = this.confService.user;
    if (!user || !user.hasAllData()) {
      this.showForm();
    } else {
      this.doAction();
    }
  }

  private doAction() {
    const user = new User(this.confService.user || this.formData.user);
    this.onActionBtnClick(user);

    if(this.isFormShown && this.formData.save) {
      this.confService.user = user;
    }
  }

  private showForm() {
    this.isFormShown = true;
  }

  private hideForm() {
    this.isFormShown = false;
  }
}
