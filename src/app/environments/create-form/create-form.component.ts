import { Component, AfterContentInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EnvironmentsService, NotificationsService, ConfigurationService } from '../../services';

@Component({
  selector: 'ac-create-form',
  templateUrl: './create-form.component.html'
})
export class CreateFormComponent implements AfterContentInit {
  private stackErrorId: number;

  @Input() data: any;
  @Input() disabled: boolean;
  @Input('configuration-name') confName: string;
  @ViewChild('createForm') form: NgForm;
  @ViewChild('confForm') configurationForm: NgForm;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private confService: ConfigurationService) {}

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
    this.configurationForm.reset();
    this.dismissStacksError();
  }

  onSelectClick() {
    if(this.stacks) {
      return;
    }

    this.dismissStacksError();

    this.envService.loadStacks()
      .catch(error => {
        this.stackErrorId = this.alerts.addError(`Unable to load environment stacks. ${error.message || error}`);
      });
  }

  private saveConfiguration() {
    const confName = this.configurationForm.value.configuration;
    const conf = this.form.value;

    this.confService.addProvisionConfiguration(confName, conf);
    this.alerts.addSuccess(`Provisioning configuration "${confName}" was saved.`);
  }

  private dismissStacksError() {
    if (this.stackErrorId) {
      this.alerts.dismiss(this.stackErrorId);
      this.stackErrorId = null;
    }
  }
}
