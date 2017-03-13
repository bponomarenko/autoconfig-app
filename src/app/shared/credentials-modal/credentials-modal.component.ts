import { Component, AfterContentInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { ModalComponent } from '../modal/modal.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { User, UserFormData } from '../../types';
import { ConfigurationService } from '../../services';

@Component({
  selector: 'ac-credentials-modal',
  templateUrl: './credentials-modal.component.html'
})
export class CredentialsModalComponent extends ModalComponent implements AfterContentInit {
  private isFormShown: boolean = false;
  private isFormValid: boolean = false;
  private formData: UserFormData;
  private formChangeSubscription: Subscription;

  @Input('credentials-only') isCredentialsOnly: boolean;
  @ViewChild('userForm') userForm: UserFormComponent;

  constructor(private confService: ConfigurationService, private chRef: ChangeDetectorRef) {
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

    this.modal.onShow.subscribe(() => {
      if(this.isCredentialsOnly) {
        this.showForm();
      }
    });
  }

  get isActionBtnDisabled() {
    return this.inProgress || (this.isFormShown ? !this.isFormValid : this.actionBtnDisabled);
  }

  protected onCancelBtnClick() {
    if(this.isFormShown) {
      this.hideForm();
    } else {
      super.onCancelBtnClick();
    }
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
    let user = this.formData.user && this.formData.user.hasAllData() ? this.formData.user : this.confService.user;
    user = new User(user);

    this.onActionBtnClick(user);

    if(this.isFormShown && this.formData.save) {
      this.confService.user = user;
    }
  }

  private showForm() {
    this.isFormShown = true;
    this.chRef.detectChanges();

    // Subscribe to user form event only when form is shown
    this.isFormValid = this.userForm.isValid;

    this.formChangeSubscription = this.userForm.isValidChange.subscribe((valid: boolean) => {
      this.isFormValid = valid;
    });
  }

  private hideForm() {
    if(this.formChangeSubscription) {
      this.formChangeSubscription.unsubscribe();
      this.formChangeSubscription = null;
      this.isFormValid = false;
    }
    this.isFormShown = false;
  }
}
