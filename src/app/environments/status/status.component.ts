import { Component, Input } from '@angular/core';

@Component({
  selector: 'ac-status',
  template: `<span class="badge badge-pill" [ngClass]="badgeClass" [tooltip]="status|status" placement="bottom">&nbsp;</span>`,
  styles: [`:host {
    font-size: 8px;
    vertical-align: super;
  }`]
})
export class StatusComponent {
  @Input() status: number = 0;

  get badgeClass(): string {
    switch(this.status) {
      case 5:
        return 'badge-success';
      case 3:
        return 'badge-primary';
      case 2:
        return `badge-warning`;
      case 1:
        return 'badge-info';
      case -1:
        return `badge-danger`;
      default:
        return 'badge-default';
    }
  }
}
