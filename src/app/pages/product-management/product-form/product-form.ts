import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  CreateProductModel,
  ProductCategoryInformation,
  ProductCategoryService,
} from '../../../core/generated';
import { ProductContentSection } from './product-content-section/product-content-section';
import { ProductColorSection } from './product-color-section/product-color-section';
import { ProductSizeSection } from './product-size-section/product-size-section';
import { InnoStoreSwitcher } from '../../../components/inno-store-switcher/inno-store-switcher';
import { SystemColor } from '../../../components/inno-store-color-selection/inno-store-color-selection';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule, // Важно!
    ProductContentSection,
    ProductColorSection,
    ProductSizeSection,
    InnoStoreSwitcher,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private categoryService = inject(ProductCategoryService);

  // --- Data ---
  categories = toSignal(this.categoryService.getAll(), {
    initialValue: [] as ProductCategoryInformation[],
  });

  // --- Inputs / Outputs ---
  initialData = input.required<CreateProductModel>();
  selectedColorId = input.required<string>();
  addedColors = input<SystemColor[]>([]);

  colorAdded = output<SystemColor>();
  colorChanged = output<string>();
  colorRemoved = output<SystemColor>();
  colorUpdated = output<{ oldId: string; newColor: SystemColor }>();

  onSave = output<CreateProductModel>();
  onSubmitForm = output();

  // --- State ---
  activeLang = signal<string>('ru');
  languageOptions = signal<string[]>(['ru', 'en']);
  isSubmitted = signal(false);

  // --- Reactive Form ---
  productForm: FormGroup;

  constructor() {
    this.productForm = this.initForm();

    // 1. EFFECT: Sync data from Parent -> Form (CLEAN VERSION)
    effect(() => {
      const data = this.initialData();

      // Stop if no data is provided
      if (!data) return;

      // Check if data is actually different to avoid unnecessary UI repaints (Optional but good)
      // if (JSON.stringify(data) === JSON.stringify(this.mapFormToModel())) return;

      // A. Build new FormArrays in memory (this doesn't trigger events yet)
      const newLocArray = this.rebuildLocalizations(data.localizations);
      const newSizesArray = this.rebuildSizes(data.sizes);
      const newColorsArray = this.fb.array([]); // Assuming colors are handled externally via signals

      // B. Swap the controls atomically using { emitEvent: false }
      // This is the magic key that prevents the infinite loop
      this.productForm.setControl('localizations', newLocArray, { emitEvent: false });
      this.productForm.setControl('sizes', newSizesArray, { emitEvent: false });
      this.productForm.setControl('colors', newColorsArray, { emitEvent: false });

      // C. Patch the rest of the simple values
      this.productForm.patchValue(
        {
          price: data.price,
          productCategoryId: data.productCategoryId,
        },
        { emitEvent: false },
      );
    });

    // 2. SUBSCRIPTION: Form -> Parent
    this.productForm.valueChanges.subscribe(() => {
      if (this.productForm.valid) {
        this.onSave.emit(this.mapFormToModel());
      }
    });
  }

  private rebuildLocalizations(locs: any[] | undefined): FormArray<FormGroup> {
    // FIX: Explicitly type the array to hold FormGroups
    const arr = this.fb.array<FormGroup>([]);

    if (locs && locs.length > 0) {
      locs.forEach((loc) => {
        arr.push(
          this.fb.group({
            languageISOCode: [loc.languageISOCode],
            name: [loc.name, Validators.required],
            description: [loc.description, Validators.required],
          }),
        );
      });
    } else {
      this.languageOptions().forEach((lang) => {
        arr.push(this.createLocalizationGroup(lang));
      });
    }
    return arr;
  }

  private rebuildSizes(sizes: any[] | undefined): FormArray<FormGroup> {
    // FIX: Explicitly type the array to hold FormGroups
    const arr = this.fb.array<FormGroup>([], [this.minArrayLength(1)]);

    if (sizes && sizes.length > 0) {
      sizes.forEach((size) => {
        const sizeGroup = this.fb.group({
          localizations: this.fb.array([]),
        });

        const nestedLocs = sizeGroup.get('localizations') as FormArray;

        if (size.localizations) {
          size.localizations.forEach((sl: any) => {
            nestedLocs.push(
              this.fb.group({
                languageISOCode: [sl.languageISOCode],
                name: [sl.name, Validators.required],
              }),
            );
          });
        }
        arr.push(sizeGroup);
      });
    }
    return arr;
  }

  private initForm(): FormGroup {
    return this.fb.group({
      productCategoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      localizations: this.fb.array<FormGroup>([]),
      sizes: this.fb.array<FormGroup>([], [this.minArrayLength(1)]),
      colors: this.fb.array([]),
    });
  }

  private createLocalizationGroup(langCode: string): FormGroup {
    return this.fb.group({
      languageISOCode: [langCode],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  private createSizeGroup(): FormGroup {
    return this.fb.group({
      localizations: this.fb.array(
        this.languageOptions().map((lang) =>
          this.fb.group({
            languageISOCode: [lang],
            name: ['', Validators.required],
          }),
        ),
      ),
    });
  }

  private minArrayLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= min ? null : { minLength: true };
      }
      return null;
    };
  }

  get sizesArray(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  addSize() {
    this.sizesArray.push(this.createSizeGroup());
  }

  removeSize(index: number) {
    this.sizesArray.removeAt(index);
  }
  logValidationErrors() {
    const form = this.productForm;
    console.group('Form Validation Debug');
    console.log('Form Status:', form.status);

    // 1. Check Root Fields
    ['price', 'productCategoryId'].forEach((key) => {
      if (form.get(key)?.invalid)
        console.error(`Root Field '${key}' is invalid`, form.get(key)?.errors);
    });

    // 2. Check Localizations (The likely culprit)
    const locs = form.get('localizations') as FormArray;
    locs.controls.forEach((group, index) => {
      if (group.invalid) {
        console.error(
          `Localization [${index}] (${group.get('languageISOCode')?.value}) is invalid:`,
          group.get('name')?.invalid ? 'Name missing' : '',
          group.get('description')?.invalid ? 'Description missing' : '',
        );
      }
    });

    // 3. Check Sizes
    const sizes = form.get('sizes') as FormArray;
    if (sizes.invalid) {
      if (sizes.errors?.['minLength']) console.error('Sizes Array: Minimum length not met');
      sizes.controls.forEach((sizeGroup, index) => {
        if (sizeGroup.invalid) console.error(`Size [${index}] is invalid`);
      });
    }
    console.groupEnd();
  }
  submit() {
    this.isSubmitted.set(true);
    this.logValidationErrors();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.addedColors().length === 0) {
      console.warn('Colors required');
      return;
    }

    this.onSubmitForm.emit();
  }

  private mapFormToModel(): CreateProductModel {
    const rawValue = this.productForm.getRawValue();
    return {
      ...rawValue,
      colors: this.addedColors().map((c) => ({ color: c.id, images: [] })),
    };
  }

  onColorAdded(c: SystemColor) {
    this.colorAdded.emit(c);
  }
  onColorChanged(c: SystemColor) {
    this.colorChanged.emit(c.id);
  }
  onColorRemoved(c: SystemColor) {
    this.colorRemoved.emit(c);
  }
  onColorUpdated(ev: any) {
    this.colorUpdated.emit(ev);
  }
}
