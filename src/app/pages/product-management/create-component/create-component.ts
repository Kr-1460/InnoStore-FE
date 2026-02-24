import { Component, computed, inject, signal } from '@angular/core';
import { ImageGrid } from '../image-grid/image-grid';
import { ProductForm } from '../product-form/product-form';
import {
  CreateProductColorModel,
  CreateProductImageModel,
  CreateProductModel,
} from '../../../core/generated';
import { SystemColor } from '../../../components/inno-store-color-selection/inno-store-color-selection';
import { getSystemColorById } from '../../../core/constants/system-colors';

@Component({
  selector: 'app-create-component',
  imports: [ImageGrid, ProductForm],
  templateUrl: './create-component.html',
  styleUrl: './create-component.scss',
})
export class CreateComponent {
  productData = signal<CreateProductModel>({
    price: 0,
    productCategoryId: '',
    localizations: [
      { name: '', description: '', languageISOCode: 'ru' },
      { name: '', description: '', languageISOCode: 'en' },
    ],
    sizes: [],
    colors: [{ color: '0', images: [] }],
  });

  colorSpecificImages = signal<Record<string, { imageUrl: string }[]>>({
    '0': [],
  });

  activeColorId = signal<string | null>('0');
  addedColorsUi = computed<SystemColor[]>(() => {
    const modelColors = this.productData().colors;
    return modelColors.map((c) => {
      const found = getSystemColorById(c.color);
      return found || { id: c.color, name: 'Unknown', hex: '#ccc' };
    });
  });

  currentImages = computed(() => {
    const activeId = this.activeColorId();
    if (!activeId) return [];

    const colorEntry = this.productData().colors.find((c) => c.color === activeId);
    return colorEntry?.images?.map((img) => img.imageUrl) || [];
  });

  onColorAdded(color: SystemColor) {
    this.productData.update((prev) => {
      if (prev.colors.some((c) => c.color === color.id)) return prev;

      const newColorEntry: CreateProductColorModel = {
        color: color.id,
        images: [],
      };

      return {
        ...prev,
        colors: [...prev.colors, newColorEntry],
      };
    });

    this.activeColorId.set(color.id);
  }

  onColorChanged(colorId: string) {
    this.activeColorId.set(colorId);
  }

  removeColor(color: SystemColor) {
    this.productData.update((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.color !== color.id),
    }));

    if (this.activeColorId() === color.id) {
      const remaining = this.productData().colors;
      this.activeColorId.set(remaining.length > 0 ? remaining[0].color : null);
    }
  }

  handleColorUpdate(event: { oldId: string; newColor: SystemColor }) {
    this.productData.update((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => {
        if (c.color === event.oldId) {
          return { ...c, color: event.newColor.id };
        }
        return c;
      }),
    }));

    if (this.activeColorId() === event.oldId) {
      this.activeColorId.set(event.newColor.id);
    }
  }

  removeImage(index: number) {
    this.modifyImages((imgs) => imgs.filter((_, i) => i !== index));
  }

  addImage(url: string) {
    this.modifyImages((imgs) => {
      const newImg: CreateProductImageModel = {
        imageUrl: url,
        orderNumber: imgs.length,
      };
      return [...imgs, newImg];
    });
  }

  updateImageOrder(newUrls: string[]) {
    this.modifyImages(() => {
      return newUrls.map((url, index) => ({
        imageUrl: url,
        orderNumber: index,
      }));
    });
  }

  private modifyImages(
    modifier: (current: CreateProductImageModel[]) => CreateProductImageModel[],
  ) {
    const activeId = this.activeColorId();
    if (!activeId) return;

    this.productData.update((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => {
        if (c.color === activeId) {
          return { ...c, images: modifier(c.images || []) };
        }
        return c;
      }),
    }));
  }

  saveProduct() {
    console.log('Payload ready for API:', this.productData());
  }

  handleFormUpdate(updatedPartial: CreateProductModel) {
    this.productData.update((prev) => ({
      ...prev,
      ...updatedPartial,
      colors: prev.colors,
    }));
  }
}
