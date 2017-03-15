import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    switch(value) {
      case 5:
        return `Configured`;
      case 4:
        return `Destroyed`;
      case 3:
        return `Provisioned, but not configured`;
      case 2:
        return `Provisioning in progress`;
      case 1:
        return `Queued`;
      case -1:
        return `Failed`;
      default:
        return `Unknown status (${value})`;
    }
  }
}
