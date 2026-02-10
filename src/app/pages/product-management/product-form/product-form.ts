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
  onSave = output<CreateProductModel>();

  activeLang = signal<string>('ru');
  languageOptions = signal<string[]>(['ru', 'en']);

  formData = signal<CreateProductModel>({
    price: 0,
    productGroupId: '',
    localizations: [
      { name: '', description: '', languageISOCode: 'ru' },
      { name: '', description: '', languageISOCode: 'en' },
    ],
    sizes: [],
    images: [],
  });

  productVariants = signal<Record<string, CreateProductModel>>({});
  selectedColorId = signal<string>('1');
  addedColors = signal<SystemColor[]>([]);

  currentLocalization = computed(() => {
    return (
      this.formData().localizations.find((l) => l.languageISOCode === this.activeLang()) ||
      this.formData().localizations[0]
    );
  });

  constructor() {
    effect(
      () => {
        this.formData.set({ ...this.initialData() });
      },
      { allowSignalWrites: true },
    );
  }

  onColorAdded(color: SystemColor) {
    this.addedColors.update((prev) => [...prev, color]);

    this.onColorChanged(color);
  }

  onColorChanged(color: SystemColor) {
    const previousColorId = this.selectedColorId();
    const currentModel = this.formData();

    this.productVariants.update((variants) => ({
      ...variants,
      [previousColorId]: { ...currentModel },
    }));

    const existingVariant = this.productVariants()[color.id];

    if (existingVariant) {
      this.formData.set(existingVariant);
    } else {
      this.formData.set({
        ...currentModel,
        images: [],
      });
    }

    this.selectedColorId.set(color.id);
  }

  removeColor(color: SystemColor) {
    this.addedColors.update((prev) => prev.filter((c) => c.id !== color.id));

    this.productVariants.update((v) => {
      const newVariants = { ...v };
      delete newVariants[color.id];
      return newVariants;
    });

    if (this.selectedColorId() === color.id) {
      const firstRemaining = this.addedColors()[0];
      if (firstRemaining) {
        this.onColorChanged(firstRemaining);
      } else {
        // Логика когда цветов не осталось
        this.selectedColorId.set('');
      }
    }
  }

  handleColorUpdate(event: { oldId: string; newColor: SystemColor }) {
    const { oldId, newColor } = event;

    // 1. Обновляем список добавленных цветов (заменяем старый на новый)
    this.addedColors.update((prev) => prev.map((c) => (c.id === oldId ? newColor : c)));

    // 2. Переносим данные модели в хранилище variants
    this.productVariants.update((v) => {
      const dataToMove = v[oldId] || this.formData(); // Берем из кэша или текущей формы
      const newVariants = { ...v };

      newVariants[newColor.id] = { ...dataToMove }; // Копируем данные на новый ID
      delete newVariants[oldId]; // Удаляем старый ID

      return newVariants;
    });

    // 3. Если мы редактировали текущий активный цвет — обновляем состояние формы
    if (this.selectedColorId() === oldId) {
      this.selectedColorId.set(newColor.id);
    }
  }

  updateName(newName: string) {
    this.formData.update((old) => {
      const locs = [...old.localizations];
      locs[0] = { ...locs[0], name: newName };
      return { ...old, localizations: locs };
    });
  }

  updatePrice(newPrice: string | number) {
    this.formData.update((old) => ({ ...old, price: newPrice }));
  }

  updateDescription(newDesc: string) {
    this.formData.update((old) => {
      const locs = old.localizations.map((l) =>
        l.languageISOCode === this.activeLang() ? { ...l, description: newDesc } : l,
      );
      return { ...old, localizations: locs };
    });
  }

  submitForm() {
    this.onSave.emit(this.formData());
  }

  addSize(): void {
    this.formData.update((state) => {
      const newSize: CreateProductSizeModel = {
        localizations: [{ name: 'Новый размер', languageISOCode: 'ru' }],
      };

      return {
        ...state,
        sizes: [...state.sizes, newSize],
      };
    });
  }

  removeSize(index: number): void {
    this.formData.update((state) => ({
      ...state,
      sizes: state.sizes.filter((_, i) => i !== index),
    }));
  }
}
