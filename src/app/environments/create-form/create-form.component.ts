import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EnvironmentsService, NotificationsService, ConfigurationService } from '../../services';
import { FieldsConfiguration } from './fields-configuration';

const fieldsConfiguration = require('./fieldsConfiguration.json');

@Component({
  selector: 'ac-create-form',
  templateUrl: './create-form.component.html'
})
export class CreateFormComponent implements OnInit, OnChanges {
  private configuration: FieldsConfiguration;

  @Input() data: any;
  @Input() disabled: boolean;
  @Input('configuration-name') confName: string;
  @ViewChild('createForm') form: NgForm;
  @ViewChild('confForm') configurationForm: NgForm;

  constructor(
    private envService: EnvironmentsService,
    private alerts: NotificationsService,
    private confService: ConfigurationService) {}

  ngOnInit() {
    this.loadStacks();
    this.resetConfiguration();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.configuration && changes['data']) {
      this.configuration.setData(changes['data'].currentValue);
    }
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get value(): any {
    return this.form.value;
  }

  reset() {
    this.form.reset();
    this.configurationForm.reset();
    this.resetConfiguration();
  }

  private loadStacks() {
    this.envService.loadStacks()
      .then(stacks => {
        const values = stacks.map(value => ({ value }));
        fieldsConfiguration.find(field => field.name === 'stack').values = values;
        this.configuration.getField('stack').setValues(values);
      })
      .catch(error => {
        this.alerts.addError(`Unable to load environment stacks. ${error.message || error}`);
      });
  }

  private saveConfiguration() {
    const confName = this.configurationForm.value.configuration;
    const conf = this.value;

    this.confService.addProvisionConfiguration(confName, conf);
    this.alerts.addSuccess(`Provisioning configuration "${confName}" was saved.`);
  }

  private resetConfiguration() {
    this.configuration = new FieldsConfiguration(fieldsConfiguration);
  }
}
