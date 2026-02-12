import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductGroupService } from '../../core/generated/services'; // Check path
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private productGroupService = inject(ProductGroupService);

  private groups = toSignal(this.productGroupService.getAll('en'), {
    initialValue: [],
  });

  protected categories = computed(() => {
    const groupNames = this.groups()
      .map((g) => g.name)
      .filter((name): name is string => !!name);

    return ['Все', ...groupNames];
  });

  protected selectedCategory = signal<string>('Все');

  protected filteredProducts = computed(() => {
    const currentCategory = this.selectedCategory();
    const allGroups = this.groups();

    if (currentCategory === 'Все') {
      return allGroups.flatMap((group) => group.products || []);
    }

    const targetGroup = allGroups.find((g) => g.name === currentCategory);
    return targetGroup?.products || [];
  });

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
