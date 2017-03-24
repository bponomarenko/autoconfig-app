import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Environment } from "app/types";
import { ConfigurationService } from "app/services";

@Component({
  selector: 'ac-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss'],
  host: {
    'class': 'container-fluid px-0 w-100'
  }
})
export class EnvironmentComponent {
  @Input() environment: Environment;
  @Output() delete: EventEmitter<string>;
  @Output() changeTTL: EventEmitter<string>;

  constructor(private configuration: ConfigurationService) {
    this.delete = new EventEmitter<string>();
    this.changeTTL = new EventEmitter<string>();
  }

  private get urls() {
    return this.configuration.navigationUrls;
  }

  private onDeleteClick() {
    this.delete.emit(this.environment.name);
  }

  private onChangeTTLClick() {
    this.changeTTL.emit(this.environment.name);
  }
}
