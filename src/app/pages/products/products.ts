import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  protected readonly selectedCategory = signal<string>('Все');
  protected readonly categories = ['Все', 'Одежда', 'Бутылки', 'Книги', 'Прочее'];
  
  protected readonly products = signal<Product[]>([
    { id: 1, name: 'Толстовка лимитированная', price: 100, image: 'hoodie', inStock: true, category: 'Одежда' },
    { id: 2, name: 'Толстовка лимитированная', price: 100, image: 'tshirt', inStock: false, category: 'Одежда' },
    { id: 3, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 4, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
    { id: 5, name: 'Толстовка лимитированная', price: 100, image: 'hoodie', inStock: true, category: 'Одежда' },
    { id: 6, name: 'Толстовка лимитированная', price: 100, image: 'tshirt', inStock: true, category: 'Одежда' },
    { id: 7, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 8, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
    { id: 9, name: 'Толстовка лимитированная', price: 100, image: 'hoodie', inStock: true, category: 'Одежда' },
    { id: 10, name: 'Толстовка лимитированная', price: 100, image: 'tshirt', inStock: true, category: 'Одежда' },
    { id: 11, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 12, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
    { id: 13, name: 'Толстовка лимитированная', price: 100, image: 'hoodie', inStock: true, category: 'Одежда' },
    { id: 14, name: 'Толстовка лимитированная', price: 100, image: 'tshirt', inStock: true, category: 'Одежда' },
    { id: 15, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 16, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
    { id: 17, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 18, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
    { id: 19, name: 'Толстовка лимитированная', price: 100, image: 'sweatshirt', inStock: true, category: 'Одежда' },
    { id: 20, name: 'Толстовка лимитированная', price: 100, image: 'bottle', inStock: true, category: 'Бутылки' },
  ]);

  protected get filteredProducts(): Product[] {
    const category = this.selectedCategory();
    if (category === 'Все') {
      return this.products();
    }
    return this.products().filter(p => p.category === category);
  }

  protected get productsCount(): number {
    return this.filteredProducts.length;
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
