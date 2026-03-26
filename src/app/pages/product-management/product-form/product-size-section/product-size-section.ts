import { Component, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { InnoStoreInput } from '../../../../components/inno-store-input/inno-store-input';
import { LOCALISATION } from '../../../../core/constants/localisation';

@Component({
  selector: 'app-product-size-section',
  imports: [CommonModule, ReactiveFormsModule, InnoStoreInput],
  templateUrl: './product-size-section.html',
  styleUrl: './product-size-section.scss',
})
export class ProductSizeSection {
  private fb = inject(FormBuilder);

  parentForm = input.required<FormGroup>();

  // 2. KEEP: We still need to know the language
  activeLang = input.required<string>();

  get sizesArray(): FormArray {
    return this.parentForm().get('sizes') as FormArray;
  }

  // Helper to create the structure for a new Size
  private createSizeGroup(): FormGroup {
    return this.fb.group({
      localizations: this.fb.array([
        // Create controls for both languages so data isn't lost when switching
        this.fb.group({ languageISOCode: ['ru'], name: ['', Validators.required] }),
        this.fb.group({ languageISOCode: ['en'], name: ['', Validators.required] }),
      ]),
    });
  }

  // --- Actions ---

  addSize() {
    this.sizesArray.push(this.createSizeGroup());
  }

  removeSize(index: number) {
    this.sizesArray.removeAt(index);
  }

  // Finds the specific 'name' control for the current active language inside a specific size
  getSizeNameControl(sizeIndex: number): AbstractControl | null {
    const sizeGroup = this.sizesArray.at(sizeIndex) as FormGroup;
    const locArray = sizeGroup.get('localizations') as FormArray;

    // Find the group that matches the current active language (e.g. 'ru' or 'en')
    const locGroup = locArray.controls.find(
      (c) => c.get('languageISOCode')?.value === this.activeLang(),
    );

    return locGroup ? locGroup.get('name') : null;
  }

  protected translations = computed(() => {
    const languageKey = this.activeLang() as keyof typeof LOCALISATION;
    return LOCALISATION[languageKey]
  })
}
