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
  private productGroupService = inject(ProductCategoryService);

  private activeLang = signal<string>('ru')

  private groups = toSignal(toObservable(this.activeLang).pipe(
    switchMap((lang) => this.productGroupService.getAll(lang))
  ),
  {
    initialValue: [],
  });

  protected categories = computed(() => {
    const groupNames = this.groups();
    const mapped = groupNames.map((g) => ({
      id: g.id,
      name: g.name || 'Unnamed'
    }));

    return [{id: 'Все', name: 'Все'}, ...mapped];
  });

  protected selectedCategory = signal<string | null>('Все');

  protected filteredProducts = computed(() => {
    const currentCategory = this.selectedCategory();
    const allGroups = this.groups();

    if (currentCategory === 'Все') {
      return allGroups.flatMap((group) => group.products || []);
    }

    const targetGroup = allGroups.find((g) => g.id=== currentCategory);
    return targetGroup?.products || [];
  });

  protected selectCategory(category: string | undefined): void {
    if(!category)return;
    this.selectedCategory.set(category);
  }
}
