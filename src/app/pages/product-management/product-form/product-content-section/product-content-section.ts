import { Component, computed, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { ProductCategoryInformation } from '../../../../core/generated/models';

import { InnoStoreInput } from '../../../../components/inno-store-input/inno-store-input';
import { InnoStoreCombobox } from '../../../../components/inno-store-combobox/inno-store-combobox';
import { LOCALISATION } from '../../../../core/constants/localisation';

@Component({
  selector: 'app-product-content-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InnoStoreInput,
    InnoStoreCombobox,
  ],
  templateUrl: './product-content-section.html',
})

export class ProductContentSection {
  parentForm = input.required<FormGroup>();
  categories = input<ProductCategoryInformation[]>([]);
  activeLang = input.required<string>();

  protected  translations = computed(() => {
    const languageKey = this.activeLang() as keyof typeof LOCALISATION;
    return LOCALISATION[languageKey];
  })

  uiCategories = computed(() => {
    const lang = this.activeLang();
    const cats = this.categories() || [];

    return cats.map((category) => {
      const translation = category.localizations?.find(l => l.languageISOCode === lang);

      return{
        id: category.id || '',
        name:translation?.name || category.localizations?.[0]?.name || 'Unnamed'
      }
    })

  });

  // Helper to pass the currently selected category to the Combobox
  // The Combobox expects an array (T[]), but we only select one.
  selectedCategoryArray = computed(() => {
    const selectedId = this.parentForm().get('productCategoryId')?.value;
    if (!selectedId) return [];

    const found = this.uiCategories().find((c) => c.id === selectedId);
    return found ? [found] : [];
  });

  // Logic to find the current language FormGroup
  currentLocalizationGroup = computed(() => {
    const form = this.parentForm();
    const locArray = form.get('localizations') as FormArray;
    const controls = locArray.controls as FormGroup[];
    return controls.find((c) => c.get('languageISOCode')?.value === this.activeLang());
  });

  // --- Handlers ---

  onCategorySelect(id: string | number) {
    this.parentForm().get('productCategoryId')?.setValue(id);
  }

  // --- Validation Helpers ---

  isFieldInvalid(fieldName: string): boolean {
    const control = this.parentForm().get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isLocFieldInvalid(fieldName: string): boolean {
    const group = this.currentLocalizationGroup();
    const control = group?.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
