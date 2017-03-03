import { Component, AfterContentInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { User, UserFormData } from '../../types';

@Component({
  selector: 'ac-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements AfterContentInit {
  @Input() disabled: boolean;
  @Input() data: UserFormData;
  @Input() showSaveCheckbox: boolean = false;
  @Output() isValidChange: EventEmitter<boolean>;
  @ViewChild('userForm') form: NgForm;

  constructor() {
    this.isValidChange = new EventEmitter<boolean>();
  }

  ngAfterContentInit() {
    if(!this.data) {
      this.data = { user: new User() };
    }

    this.form.statusChanges.subscribe((status: string) => {
      this.isValidChange.emit(status === 'VALID');
    });
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get isPristine(): boolean {
    return this.form.pristine;
  }

  reset(data?: UserFormData) {
    this.form.reset(data);
  }

  private getFormGroupClasses(controlName: string) {
    const control = this.getFormControl(controlName);
    return {
      'has-success': this.isShowSuccess(control),
      'has-danger': this.isShowError(control),
      'mb-0': controlName === 'password' && !this.showSaveCheckbox
    };
  }

  private getFormControlClasses(controlName: string) {
    const control = this.getFormControl(controlName);
      return {
      'form-control-success': this.isShowSuccess(control),
      'form-control-danger': this.isShowError(control)
    };
  }

  private getFormControl(controlName: string): FormControl {
    const user = this.form && (<FormGroup>this.form.controls['user']);
    return user && (<FormControl>user.controls[controlName]);
  }

  private isShowError(control: FormControl): boolean {
    return control && (control.value && control.pristine || control.touched) && control.invalid;
  }

  private isShowSuccess(control: FormControl): boolean {
    return control && control.value && control.valid && !control.pristine;
  }
}
