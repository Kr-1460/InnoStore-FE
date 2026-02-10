import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CreateProductModel, CreateProductSizeModel } from '../../../core/generated';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductContentSection } from './product-content-section/product-content-section';
import { ProductColorSection } from './product-color-section/product-color-section';
import { ProductSizeSection } from './product-size-section/product-size-section';
import { InnoStoreSwitcher } from '../../../components/inno-store-switcher/inno-store-switcher';
import { SystemColor } from '../../../components/inno-store-color-selection/inno-store-color-selection';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    FormsModule,
    ProductContentSection,
    ProductColorSection,
    ProductSizeSection,
    InnoStoreSwitcher,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  initialData = input.required<CreateProductModel>();
  selectedColorId = input.required<string>();
  addedColors = input<SystemColor[]>([]);
  colorAdded = output<SystemColor>();
  colorChanged = output<string>();
  colorRemoved = output<SystemColor>();
  colorUpdated = output<{ oldId: string; newColor: SystemColor }>();
  onSave = output<CreateProductModel>();
  onSubmitForm = output();

  activeLang = signal<string>('ru');
  languageOptions = signal<string[]>(['ru', 'en']);

  formData = signal<CreateProductModel>({
    price: 0,
    productGroupId: '',
    localizations: [],
    sizes: [],
    images: [],
  });

  productVariants = signal<Record<string, CreateProductModel>>({});

  currentLocalization = computed(() => {
    return (
      this.formData().localizations.find((l) => l.languageISOCode === this.activeLang()) ||
      this.formData().localizations[0]
    );
  });

  constructor() {
    effect(
      () => {
        const data = this.initialData();
        if (data) {
          this.formData.set(data);
        }
      },
      { allowSignalWrites: true },
    );
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
    console.log(ev);
    this.colorUpdated.emit(ev);
  }

  updateName(newName: string) {
    this.formData.update((old) => {
      const locs = old.localizations.map((l) => ({ ...l }));

      const idx = locs.findIndex((l) => l.languageISOCode === this.activeLang());

      if (idx !== -1) {
        locs[idx].name = newName;
      } else {
        locs.push({ name: newName, description: '', languageISOCode: this.activeLang() });
      }

      const updated = { ...old, localizations: locs };

      this.onSave.emit(updated);
      return updated;
    });
  }

  updatePrice(newPrice: string | number) {
    this.formData.update((old) => {
      const updated = { ...old, price: Number(newPrice) };
      this.onSave.emit(updated);
      return updated;
    });
  }

  updateDescription(newDesc: string) {
    this.formData.update((old) => {
      const locs = old.localizations.map((l) =>
        l.languageISOCode === this.activeLang() ? { ...l, description: newDesc } : l,
      );
      const updated = { ...old, localizations: locs };
      this.onSave.emit(updated);
      return updated;
    });
  }

  submitForm() {
    this.onSubmitForm.emit();
  }

  addSize(): void {
    this.formData.update((state) => {
      const newSize: CreateProductSizeModel = {
        localizations: [{ name: 'Новый размер', languageISOCode: 'ru' }],
      };
      const updated = {
        ...state,
        sizes: [...state.sizes, newSize],
      };
      this.onSave.emit(updated);
      return updated;
    });
  }

  removeSize(index: number): void {
    this.formData.update((state) => {
      const updated = {
        ...state,
        sizes: state.sizes.filter((_, i) => i !== index),
      };
      this.onSave.emit(updated);
      return updated;
    });
  }
}
