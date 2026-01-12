import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelSplit',
  pure: true
})
export class CamelSplitPipe implements PipeTransform {
  public static camelFinder: RegExp = /([a-z])([A-Z])/gm;

  transform(value: string): string {
    return value.replaceAll(CamelSplitPipe.camelFinder, '$1 $2');
  }

}
