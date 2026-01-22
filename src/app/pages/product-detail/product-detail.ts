import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product.interface';
import { CloseIcon } from '../../components/icons/close-icon/close-icon';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, CloseIcon],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  protected readonly selectedImageIndex = signal(0);
  protected readonly selectedSize = signal<string | null>(null);
  protected readonly selectedColor = signal<string | null>(null);
  protected readonly product = signal<Product | null>(null);

  constructor(private route: ActivatedRoute) {
    const productId = this.route.snapshot.paramMap.get('id');
    this.loadProduct(Number(productId));
  }

  private loadProduct(id: number): void {
    const mockProducts: Record<number, Product> = {
      1: {
        id: 1,
        name: 'Толстовка лимитированная',
        fullName: 'Толстовка лимитированной серии дизайн 2026 года',
        price: 120,
        image: 'sweatshirt',
        images: ['sweatshirt', 'sweatshirt', 'sweatshirt', 'sweatshirt'],
        inStock: true,
        category: 'Одежда',
        sizes: [
          { label: 'S', value: '46' },
          { label: 'M', value: '48' },
          { label: 'L', value: '50' },
          { label: 'XL', value: '52' },
          { label: '2XL', value: '54' }
        ],
        colors: [
          { id: 'black', name: 'Черный', image: 'sweatshirt' },
          { id: 'black2', name: 'Черный', image: 'sweatshirt' },
          { id: 'black3', name: 'Черный', image: 'sweatshirt' },
          { id: 'black4', name: 'Черный', image: 'sweatshirt' }
        ]
      },
      4: {
        id: 4,
        name: 'Бутылка',
        fullName: 'Бутылка для воды innowise',
        price: 100,
        image: 'bottle',
        images: ['bottle', 'bottle', 'bottle', 'bottle'],
        inStock: true,
        category: 'Бутылки',
        sizes: [
          { label: 'Один размер', value: 'one-size' }
        ],
        colors: [
          { id: 'white', name: 'Белый', image: 'bottle' }
        ]
      }
    };

    const product = mockProducts[id] || mockProducts[1];
    this.product.set(product);
    
    if (product.sizes.length > 0) {
      this.selectedSize.set(product.sizes[0].value);
    }
    if (product.colors.length > 0) {
      this.selectedColor.set(product.colors[0].id);
    }
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected selectSize(sizeValue: string): void {
    this.selectedSize.set(sizeValue);
  }

  protected selectColor(colorId: string): void {
    this.selectedColor.set(colorId);
  }

  protected get showSizes(): boolean {
    const product = this.product();
    return product ? product.sizes.length > 1 : false;
  }

  protected placeOrder(): void {
    console.log('Оформление заказа', {
      product: this.product(),
      size: this.selectedSize(),
      color: this.selectedColor()
    });
  }
}
