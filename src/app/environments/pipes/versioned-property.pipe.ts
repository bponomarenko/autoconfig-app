import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versionedProperty'
})
export class VersionedPropertyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const propValue = value[args];
    const versionProp = propValue + '_version';
    const suffix = versionProp in value ? ` | ${value[versionProp]}` : '';
    return propValue + suffix;
  }

}
