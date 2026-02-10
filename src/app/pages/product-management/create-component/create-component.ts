import { Component, computed, inject, signal } from '@angular/core';
import { ImageGrid } from '../image-grid/image-grid';
import { ProductForm } from '../product-form/product-form';
import { CreateProductModel } from '../../../core/generated';
import { SystemColor } from '../../../components/inno-store-color-selection/inno-store-color-selection';

@Component({
  selector: 'app-create-component',
  imports: [ImageGrid, ProductForm],
  templateUrl: './create-component.html',
  styleUrl: './create-component.scss',
})
export class CreateComponent {
  commonProductData = signal<Omit<CreateProductModel, 'images'>>({
    price: 0,
    productGroupId: '',
    localizations: [
      { name: '', description: '', languageISOCode: 'ru' },
      { name: '', description: '', languageISOCode: 'en' },
    ],
    sizes: [],
  });

  colorSpecificImages = signal<Record<string, { imageUrl: string }[]>>({
    '0': [], // Начальный цвет
  });

  addedColors = signal<SystemColor[]>([{ id: '0', name: 'Прозрачный', hex: '#00000000' }]);
  selectedColorId = signal<string>('0');

  activeProductData = computed((): CreateProductModel => {
    const id = this.selectedColorId();
    const images = this.colorSpecificImages()[id] || [];

    return {
      ...this.commonProductData(),
      images: images,
    };
  });

  currentImages = computed(() => this.activeProductData().images?.map((img) => img.imageUrl) || []);

  onColorAdded(color: SystemColor) {
    this.addedColors.update((prev) => [...prev, color]);

    // Создаем пустой массив картинок для нового цвета
    this.colorSpecificImages.update((v) => ({
      ...v,
      [color.id]: [],
    }));

    this.selectedColorId.set(color.id);
  }

  onColorChanged(colorId: string) {
    this.selectedColorId.set(colorId);
  }

  removeColor(color: SystemColor) {
    this.addedColors.update((prev) => prev.filter((c) => c.id !== color.id));

    this.colorSpecificImages.update((v) => {
      const newVariants = { ...v };
      delete newVariants[color.id];
      return newVariants;
    });

    if (this.selectedColorId() === color.id) {
      const nextColor = this.addedColors()[0];
      this.selectedColorId.set(nextColor ? nextColor.id : '');
    }
  }

  handleColorUpdate(event: { oldId: string; newColor: SystemColor }) {
    const { oldId, newColor } = event;

    this.addedColors.update((prev) => prev.map((c) => (c.id === oldId ? newColor : c)));

    this.colorSpecificImages.update((v) => {
      const data = v[oldId];
      const newVariants = { ...v };
      newVariants[newColor.id] = { ...data };
      delete newVariants[oldId];
      return newVariants;
    });

    if (this.selectedColorId() === oldId) {
      this.selectedColorId.set(newColor.id);
    }
  }

  private getEmptyModel(): CreateProductModel {
    return {
      price: 0,
      productGroupId: '',
      localizations: [
        { name: '', description: '', languageISOCode: 'ru' },
        { name: '', description: '', languageISOCode: 'en' },
      ],
      sizes: [],
      images: [],
    };
  }

  updateImages(newUrls: string[]) {
    const colorId = this.selectedColorId();
    this.colorSpecificImages.update((prev) => ({
      ...prev,
      [colorId]: newUrls.map((url) => ({ imageUrl: url })),
    }));
  }

  removeImage(index: number) {
    const current = this.currentImages().filter((_, i) => i !== index);
    this.updateImages(current);
  }

  addImage(url: string) {
    const current = [...this.currentImages(), url];
    this.updateImages(current);
  }

  updateImageOrder(newOrder: string[]) {
    this.updateImages(newOrder);
  }

  saveProduct() {
    const finalVariants = this.addedColors().map((color) => ({
      ...this.commonProductData(),
      images: this.colorSpecificImages()[color.id] || [],
      colorId: color.id,
    }));

    console.log('Final Data for API:', finalVariants);
  }

  handleFormUpdate(updated: CreateProductModel) {
    this.commonProductData.set({
      price: updated.price,
      productGroupId: updated.productGroupId,
      localizations: updated.localizations,
      sizes: updated.sizes,
    });
  }
}
