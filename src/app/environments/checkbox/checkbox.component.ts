import { Component, AfterViewInit, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'ac-checkbox',
  template: `
    <input type="checkbox"
      #checkbox
      (change)="onChange($event.target.checked ? 'yes' : 'no')"
      (blur)="onTouched()"
      [disabled]="disabled">
  `,
  styles: [
    ':host { display: inline-block }'
  ],
  providers: [VALUE_ACCESSOR]
})
export class CheckboxComponent implements AfterViewInit, ControlValueAccessor {
  private elem: HTMLInputElement;

  @Input() disabled: boolean;
  @ViewChild('checkbox') checkbox;

  constructor() { }

  ngAfterViewInit() {
    this.elem = this.checkbox.nativeElement;
  }

  onChange() {}

  onTouched() {}

  writeValue(value: any) {
    if(this.elem) {
      this.elem.checked = value === 'yes';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabled(isDisabled: boolean) {
    if (this.elem) {
      this.elem.disabled = isDisabled;
    }
  }
}
