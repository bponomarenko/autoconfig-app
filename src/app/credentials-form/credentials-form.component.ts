import { Component, ViewChild, Output, Input, EventEmitter, AfterContentInit } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

import { User } from '../types/user';

@Component({
  selector: 'ac-credentials-form',
  templateUrl: './credentials-form.component.html'
})
export class CredentialsFormComponent implements AfterContentInit {
  @ViewChild('userForm') form: NgForm;
  @Input() saveCheckbox: boolean = false;
  @Input() data: { user: User, save?: boolean };
  @Input() disabled: boolean;
  @Output() isValid: EventEmitter<boolean>;

  constructor() {
    this.isValid = new EventEmitter<boolean>();
  }

  ngAfterContentInit() {
    if(!this.data) {
      this.data = { user: new User() };
    }

    this.form.statusChanges.subscribe((status: string) => {
      this.isValid.emit(status === 'VALID');
    });
  }

  getFormGroupClasses(controlName: string) {
    const control = this.getFormControl(controlName);
    return {
      'has-success': control && control.value && control.valid,
      'has-danger': this.isShowError(control),
      'mb-0': controlName === 'password' && !this.saveCheckbox
    };
  }

  getFormControlClasses(controlName: string) {
    const control = this.getFormControl(controlName);
    return {
      'form-control-success': control && control.value && control.valid,
      'form-control-danger': this.isShowError(control)
    };
  }

  getFormControl(controlName: string): FormControl {
    const user = this.form && (<FormGroup>this.form.controls['user']);
    return user && (<FormControl>user.controls[controlName]);
  }

  isShowError(control: FormControl): boolean {
    return control && (control.value && control.pristine || control.touched) && control.invalid;
  }

  reset() {
    this.form.reset();
  }
}
