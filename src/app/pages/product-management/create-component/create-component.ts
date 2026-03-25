import { Component, computed, inject, Signal, signal, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

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
  private readonly router = inject(Router)

  private translations: any = {
    ru: {
      successAdd: "продукт успешно добавлен",
      error: "ошибка добавления продукта. проверьте данные и повторите попытку"
    },
    en: {
      successAdd: "product was successfully added",
      error: "The product wasn't successfully added! Check your data and try again"
    }
  }

  private currentLang = computed(() => this.productData().localizations[0].languageISOCode || 'ru');

  filesToUpload = signal<{file: File, previewUrl: string, colorId: string}[]>([]);

  protected hasImages = computed(() => this.filesToUpload.length>0);

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
    this.filesToUpload.update(prev => prev.filter((_, i) => i !== index));
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
    const activeId = this.activeColorId();
    if(!activeId) return;
    this.filesToUpload.update(prev => [...prev, { ...event, colorId: activeId }]);
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

    const files = this.filesToUpload();
    const uploadTasks = files.map(f => this.fileService.uploadFile(f.file));
    const lang = this.currentLang();
    const url = this.router.url;

    forkJoin(uploadTasks).pipe(
      switchMap((responses) => {
        const uploadedData = responses.map((res, index) => ({
        url: res.fileUrl,
        colorId: files[index].colorId
      }));

        const productData = this.productData();

        const finalData: CreateProductModel = {
        price: productData.price,
        productCategoryId: productData.productCategoryId,
        localizations: productData.localizations,
        sizes: productData.sizes,
        colors: productData.colors.map(color => {
          const colorImages = uploadedData
            .filter(d => d.colorId === color.color)
            .map((d, index) => ({
              imageUrl: d.url,
              orderNumber: index
            }));
        return {
            color: color.color,
            images: colorImages
          };
        })
      };
        return this.productService.createProduct(finalData)
      })
    ).subscribe({
      next: (response) => {
        console.log('product was successfully created', response);

        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([url])
        }

        )

        this.toastr.success(this.translations[lang].successAdd)
      },
      error: (error) => {
        this.toastr.error(this.translations[lang].error)
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
