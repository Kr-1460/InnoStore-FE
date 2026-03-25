import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCategoryService, ProductService } from '../../core/generated/services'; // Check path
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductCategoryInformation, ProductDTO } from '../../core/generated';
import { filter, switchMap } from 'rxjs';
import { ProductForm } from '../product-management/product-form/product-form';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private productCategoryService = inject(ProductCategoryService);
  private productService = inject(ProductService);

  private activeLang = signal<string>('ru')

  private allProducts = toSignal(toObservable(this.activeLang).pipe(
    switchMap((lang) => this.productService.getProducts(lang))
  ),
    { initialValue: [] as ProductDTO[] },
  );

  private groups = toSignal(toObservable(this.activeLang).pipe(
    switchMap((lang) => this.productCategoryService.getAll(lang))
  ),
  {
    initialValue: [] as ProductCategoryInformation[]
  });

  protected categories = computed(() => {
    const lang = this.activeLang();
    const groupNames = this.groups();

    const mapped = groupNames.map((g) => {
      const translation = g.localizations?.find(l => l.languageISOCode === lang);
      return {
        id: g.id,
        name: translation?.name || g.localizations?.[0]?.name || 'Unnamed'
      };
    });

    return [{id: 'Все', name: 'Все'}, ...mapped];
  });

  protected selectedCategory = signal<string | null>('Все');

  protected filteredProducts = computed(() => {
    const products = this.allProducts() || [];
    const currentCategory = this.selectedCategory();

    const allGroups = this.groups();

    if (currentCategory === 'Все') {
      return products;
    }

    return products.filter(p => p?.productCategoryId === currentCategory);
  });

  protected selectCategory(category: string | undefined): void {
    if(!category)return;
    this.selectedCategory.set(category);
  }
}
