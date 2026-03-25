import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CloseIcon } from '../../components/icons/close-icon/close-icon';
import { ProductService } from '../../core/generated/services'; // Check your import path
import { ProductDTO, ProductImageDTO } from '../../core/generated/models'; // Check your import path
import { getSystemColorById, SYSTEM_COLORS } from '../../core/constants/system-colors';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, CloseIcon],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private activeLang = signal<string>('ru')

  // Signals
  protected readonly product = signal<ProductDTO | null>(null);

  protected readonly selectedSystemColorId = signal<string | null>(null);
  protected readonly selectedSizeId = signal<string | null>(null);
  protected readonly selectedImageIndex = signal(0);

  protected selectedColor = computed(() => {
    const currentId = this.selectedSystemColorId();
    return this.availableColors().find((c) => c.color === currentId);
  });

  protected currentGallery = computed<ProductImageDTO[]>(() => {
    const p = this.product();
    const colorId = this.selectedSystemColorId();

    if (!p || !p.colors) return [];

    // Find the color entry in the product that matches the selected system ID
    const activeColor = p.colors.find((c) => c.color === colorId);

    // Sort by orderNumber if available, otherwise return as is
    return activeColor?.images || [];
  });

  protected mainImageUrl = computed<string | null>(() => {
    const images = this.currentGallery();
    const index = this.selectedImageIndex();
    return images[index]?.imageUrl || images[0]?.imageUrl || null;
  });

  protected availableColors = computed(() => {
    const p = this.product();
    if (!p || !p.colors) return [];

    return p.colors.map((pc) => {
      const systemColor = getSystemColorById(pc.color);
      return {
        ...pc, // Keep ProductColorDTO data (images, id, etc)
        hex: systemColor?.hex || '#ccc', // Fallback hex
        name: systemColor?.name || 'Unknown',
      };
    });
  });

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProductById(id, this.activeLang()).subscribe({
      next: (data) => {
        this.product.set(data);
        this.initDefaults(data);
      },
      error: (err) => console.error('Failed to load product', err),
    });
  }

  private initDefaults(product: ProductDTO): void {
    if (product.sizes && product.sizes.length > 0) {
      this.selectedSizeId.set(product.sizes[0].id || null);
    }

    if (product.colors && product.colors.length > 0) {
      this.selectedSystemColorId.set(product.colors[0].color);
    }

    this.selectedImageIndex.set(0);
  }

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected selectSize(sizeId: string): void {
    this.selectedSizeId.set(sizeId);
  }

  protected selectColor(systemColorId: string): void {
    if (this.selectedSystemColorId() !== systemColorId) {
      this.selectedSystemColorId.set(systemColorId);
      this.selectedImageIndex.set(0); // Reset gallery to start
    }
  }

  protected placeOrder(): void {
    const p = this.product();
    if (!p) return;

    const selectedColorObj = p.colors?.find((c) => c.color === this.selectedSystemColorId());

    console.log('Placing order:', {
      productId: p.id,
      sizeId: this.selectedSizeId(),
      productColorId: selectedColorObj?.id,
    });
  }
}
