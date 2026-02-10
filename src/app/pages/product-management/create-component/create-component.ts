import { Component, inject, signal } from '@angular/core';
import { ImageGrid } from '../image-grid/image-grid';
import { ProductForm } from '../product-form/product-form';
import { CreateProductModel } from '../../../core/generated';

@Component({
  selector: 'app-create-component',
  imports: [ImageGrid, ProductForm],
  templateUrl: './create-component.html',
  styleUrl: './create-component.scss',
})
export class CreateComponent {
  productData = signal<CreateProductModel>({
    price: 100,
    productGroupId: '',
    localizations: [
      {
        name: 'Толстовка лимитированной серии дизайн 2026 года',
        description: '',
        languageISOCode: 'ru',
      },
      {
        name: '',
        description: '',
        languageISOCode: 'en',
      },
    ],
    sizes: [],
    images: [],
  });

  images = signal<string[]>(Array(9).fill('https://picsum.photos/200/300'));

  removeImage(index: number) {
    this.images.update((prev) => prev.filter((_, i) => i !== index));
  }

  addImage(newImageUrl: string) {
    this.images.update((prev) => [...prev, newImageUrl]);
  }

  saveProduct(formData: CreateProductModel) {
    const payload = {
      ...formData,
      images: this.images().map((url) => ({ imageUrl: url })),
    };
    console.log('Final Payload for API:', payload);
  }

  updateImageOrder(newOrder: string[]) {
    this.images.set(newOrder);
  }
}
