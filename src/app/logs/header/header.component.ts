import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EnvironmentsService } from '../../services';

@Component({
  selector: 'ac-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() disabled: boolean = false;
  @Input('environment-name') envName: string;
  @Output() reload: EventEmitter<void>;

  constructor(private envService: EnvironmentsService) {
    this.reload = new EventEmitter<void>();
  }

  private loadLogs() {
    this.reload.emit();
  }
}
