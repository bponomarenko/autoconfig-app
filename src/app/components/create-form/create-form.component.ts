import { Component, AfterContentInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EnvironmentsService, NotificationsService } from '../../services';

@Component({
  selector: 'ac-create-form',
  templateUrl: './create-form.component.html'
})
export class CreateFormComponent implements AfterContentInit {
  private stackErrorId: number;
  // private configuration: string;

  @Input() data: any;
  @Input() disabled: boolean;
  @ViewChild('createForm') form: NgForm;

  constructor(private envService: EnvironmentsService, private alerts: NotificationsService) {}

  ngAfterContentInit() {
    if(!this.data) {
      this.data = { };
    }
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get stacks(): string[] {
    return this.envService.stacks;
  }

  get loading(): boolean {
    return this.envService.loadingStacks;
  }

  reset() {
    this.form.reset();
    this._dismissStacksError();
  }

  onSelectClick() {
    if(this.stacks) {
      return;
    }

    this._dismissStacksError();

    this.envService.loadStacks()
      .catch(error => {
        this.stackErrorId = this.alerts.addError(`Unable to load environment stacks. ${error.message || error}`);
      });
  }

  private _dismissStacksError() {
    if (this.stackErrorId) {
      this.alerts.dismiss(this.stackErrorId);
      this.stackErrorId = null;
    }
  }
}
