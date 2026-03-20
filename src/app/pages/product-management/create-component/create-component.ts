import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { ImageGrid } from '../image-grid/image-grid';
import { ProductForm } from '../product-form/product-form';
import {
  CreateProductColorModel,
  CreateProductImageModel,
  CreateProductModel,
  FileService,
  ProductService,
} from '../../../core/generated';
import { SystemColor } from '../../../components/inno-store-color-selection/inno-store-color-selection';
import { getSystemColorById } from '../../../core/constants/system-colors';
import { response } from 'express';
import { forkJoin, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-component',
  imports: [ImageGrid, ProductForm],
  templateUrl: './create-component.html',
  styleUrl: './create-component.scss',
})
export class CreateComponent {
  @ViewChild(ProductForm) productForm !: ProductForm;
  private readonly productService = inject(ProductService);
  private readonly fileService = inject(FileService);
  private readonly toastr = inject(ToastrService)

  filesToUpload: {file: File, previewUrl: string}[] = [];

  productData = signal<CreateProductModel>({
    price: 0,
    productGroupId: '',
    localizations: [
      { name: '', description: '', languageISOCode: 'ru' },
      { name: '', description: '', languageISOCode: 'en' },
    ],
    sizes: [],
    colors: [{ color: '0', images: [] }],
    images: [],
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

  onImageAdded(event: {file: File, previewUrl: string}){
    this.filesToUpload.push(event);
    this.addImage(event.previewUrl)
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

    const uploadTasks = this.filesToUpload.map(f => this.fileService.uploadFile(f.file));

    forkJoin(uploadTasks).pipe(
      switchMap((responses) => {
        const urls = responses.map(r => r.fileUrl);

        const finalData = {
          ...this.productData(),
          images: urls.map(url => ({
            ImageUrl: url
          }))
        };
        return this.productService.createProduct(finalData)
      })
    ).subscribe({
      next: (response) => {
        console.log('product was successfully created', response);

        if(this.productForm){
          this.productForm.resetForm()
          this.filesToUpload = []
        }

        this.toastr.success("The product was successfully added!")
      },
      error: (error) => {
        this.toastr.error("The product wasn't successfully added! Check your data and try again")
        console.error('smth went wrong', error)
      }
    });
  }

  handleFormUpdate(updatedPartial: CreateProductModel) {
    this.productData.update((prev) => ({
      ...prev,
      ...updatedPartial,
      colors: prev.colors,
    }));
  }
}
