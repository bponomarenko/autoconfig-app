import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'expires'
})
export class ExpiresPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(value.length === 0) {
      return value;
    }

    const date = moment(value);
    return date.isAfter() ? `Expires ${date.fromNow()}` : 'Expires now';
  }
}
