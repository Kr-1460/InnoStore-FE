import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCategoryService, ProductService } from '../../core/generated/services'; // Check path
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductCategoryInformation, ProductDTO } from '../../core/generated';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private categoryService = inject(ProductCategoryService);
  private productService = inject(ProductService);

  activeLang = signal('ru');
  selectedCategoryId = signal<string | null>(null);

  private rawCategories = toSignal(toObservable(this.activeLang).pipe(
    switchMap((lang) => this.categoryService.getAll(lang))
  ), {
    initialValue: [] as ProductCategoryInformation[],
  });

  private rawProducts = toSignal(this.productService.getProducts(), {
    initialValue: [] as ProductDTO[],
  });

  uiCategories = computed(() => {
    const list = this.rawCategories();
    const lang = this.activeLang();

    const mapped = list.map((cat) => {
      const loc =
        cat.localizations?.find((l) => l.languageISOCode === lang) || cat.localizations?.[0];
      return {
        id: cat.id,
        name: loc?.name || 'Unnamed',
      };
    });

    // Add "All" option at the beginning
    return [{ id: null, name: 'Все' }, ...mapped];
  });

  filteredProducts = computed(() => {
    const allProducts = this.rawProducts();
    const selectedId = this.selectedCategoryId();

    // If no data yet
    if (!allProducts) return [];

    // If "All" is selected (id is null), return everything
    if (!selectedId) {
      return allProducts;
    }

    // Filter by Category ID
    // Ensure your ProductDTO has 'productCategoryId'
    return allProducts.filter((p) => p.productGroupId === selectedId);
  });

  selectCategory(id: string | null | undefined): void {
    console.log(id);
    if (id != undefined) {
      this.selectedCategoryId.set(id);
    }
  }
}
