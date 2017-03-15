import { Component, Input } from '@angular/core';

@Component({
  selector: 'ac-status',
  template: `<span class="badge badge-pill" [ngClass]="badgeClass" [tooltip]="title" placement="bottom">&nbsp;</span>`,
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

  get title(): string {
    let text: string;
    switch(this.status) {
      case 5:
        text = `Configured`;
        break;
      case 4:
        text = `Destroyed`;
        break;
      case 3:
        text = `Provisioned, but not configured`;
        break;
      case 2:
        text = `Provisioning in progress`;
        break;
      case 1:
        text = `Queued`;
        break;
      case -1:
        text = `Failed`;
        break;
      default:
        text = `Unknown status`;
        break;
    }
    return `${text} (${this.status})`;
  }
}
