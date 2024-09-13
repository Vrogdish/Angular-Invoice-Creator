import { Pipe, PipeTransform } from '@angular/core';
import { TvaEnum } from '../../features/products/models/product.model';

@Pipe({
  name: 'tva',
  standalone: true,
})
export class TvaPipe implements PipeTransform {
  transform(value: TvaEnum): string {
    switch (value) {
      case TvaEnum.Normal:
        return 'Taux normal (20%)';
      case TvaEnum.intermediaire:
        return 'Taux intermédiaire (10%)';
      case TvaEnum.reduit:
        return 'Taux réduit (5.5%)';
      case TvaEnum.particulier:
        return 'Taux particulier (2.1%)';
    }
  }
}
