import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EnvironmentsService } from '../../services';
import { Environment } from '../../types';

@Component({
  selector: 'ac-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() disabled: boolean = false;
  @Input('environment-name') envName: string;
  @Output('environment-nameChange') envNameChange: EventEmitter<string>;
  @Output() reload: EventEmitter<void>;

  constructor(private envService: EnvironmentsService) {
    this.reload = new EventEmitter<void>();
    this.envNameChange = new EventEmitter<string>();
  }

  private get loadingEnv(): boolean {
    return this.envService.loadingEnvironments;
  }

  private get environments(): string[] {
    return (this.envService.environments || [])
      .map((env: Environment) => env.name);
  }

  private loadLogs() {
    this.reload.emit();
  }

  private onSelectClick() {
    if(!this.environments && !this.loadingEnv) {
      this.envService.loadEnvironments();
    }
  }

  private onChange(environmentName: string) {
    this.envNameChange.emit(environmentName);
    this.loadLogs();
  }
}
