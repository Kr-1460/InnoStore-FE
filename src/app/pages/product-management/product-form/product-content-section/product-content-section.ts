import { Component, input, output } from '@angular/core';
import { InnoStoreInput } from '../../../../components/inno-store-input/inno-store-input';

@Component({
  selector: 'app-product-content-section',
  imports: [InnoStoreInput],
  templateUrl: './product-content-section.html',
  styleUrl: './product-content-section.scss',
})
export class ProductContentSection {
  name = input.required<string>();
  price = input.required<number | string>();
  description = input<string>('');

  nameChange = output<string>();
  priceChange = output<number | string>();
  descriptionChange = output<string>();
}
