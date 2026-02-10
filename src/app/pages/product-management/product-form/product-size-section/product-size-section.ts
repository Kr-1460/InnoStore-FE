import { Component, input, output } from '@angular/core';
import { CreateProductSizeModel } from '../../../../core/generated';
import { InnoStoreChip } from '../../../../components/inno-store-chip/inno-store-chip';

@Component({
  selector: 'app-product-size-section',
  imports: [InnoStoreChip],
  templateUrl: './product-size-section.html',
  styleUrl: './product-size-section.scss',
})
export class ProductSizeSection {
  sizes = input.required<CreateProductSizeModel[]>();
  addSize = output<void>();
  removeSize = output<number>();
}
