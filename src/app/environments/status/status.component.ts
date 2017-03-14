import { Component, Input } from '@angular/core';

@Component({
  selector: 'ac-status',
  template: `<span class="badge badge-pill" [ngClass]="badgeClass" tooltip="{{title}}" placement="bottom">&nbsp;</span>`,
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
      case 2:
        return `badge-danger`;
      default:
        return 'badge-default';
    }
  }

  get title(): string {
    let text: string;
    switch(this.status) {
      case 5:
        text = `OK`;
        break;
      case 2:
        text = `Deleted`;
        break;
      default:
        text = `Unknown status`;
        break;
    }
    return `${text} (${this.status})`;
  }
}
