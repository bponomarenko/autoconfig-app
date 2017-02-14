import { Component, AfterContentInit, ViewChild, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ModalComponent, UserFormComponent } from '..';
import { User } from '../../types';
import { UserService } from '../../services';

@Component({
  selector: 'ac-credentials-modal',
  templateUrl: './credentials-modal.component.html'
})
export class CredentialsModalComponent extends ModalComponent implements AfterContentInit, OnChanges {
  private isFormShown: boolean = false;
  private isFormValid: boolean = false;
  private formData: { user: User, save?: boolean };

  private formChangeSubscription: Subscription;
  @ViewChild('userForm') userForm: UserFormComponent;

  constructor(private userService: UserService) {
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

  private onActionBtnClick() {
    // Try to save with user or show user form
    const user = this.userService.user;
    if (!user || !user.hasAllData()) {
      this.showForm();
    } else {
      this.doAction(user);
    }
  }

  private doAction(actionUser?: User) {
    const user = new User(actionUser || this.formData.user);
    Promise.resolve(this.actionBtnAction(user))
      .then(() => {
        if(this.isFormShown && this.formData.save) {
          this.userService.user = user;
        }
      })
      // Ignore any potential issues as they should be processed in the caller
      .catch(() => {});
  }

  private showForm() {
    this.isFormShown = true;
  }

  private hideForm() {
    this.isFormShown = false;
  }
}
