import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decode'
})
export class DecodePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? decodeURIComponent(value) : value;
  }
}
