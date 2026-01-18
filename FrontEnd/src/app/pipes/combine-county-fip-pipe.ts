import { Pipe, PipeTransform } from '@angular/core';
import { combineCountyFIP, County, CountyCSVItem } from '../models/gov/models';

@Pipe({
  name: 'combineCountyFip',
  pure: true
})
export class CombineCountyFipPipe implements PipeTransform {

  transform(county: County | CountyCSVItem): string {
    return combineCountyFIP(county);
  }

}
