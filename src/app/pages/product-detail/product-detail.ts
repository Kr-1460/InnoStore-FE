import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CloseIcon } from '../../components/icons/close-icon/close-icon';
import { ProductService } from '../../core/generated/services'; // Check your import path
import { ProductDTO } from '../../core/generated/models'; // Check your import path

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, CloseIcon],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  // Signals
  protected readonly product = signal<ProductDTO | null>(null);
  protected readonly selectedImageIndex = signal(0);
  protected readonly selectedSizeId = signal<string | null>(null);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProductById(id, 'en').subscribe({
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

    this.selectedImageIndex.set(0);
  }
  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected selectSize(sizeId: string): void {
    this.selectedSizeId.set(sizeId);
  }

  // protected selectColor(colorId: string): void {
  //   this.selectedColor.set(colorId);
  // }

  protected currentImageUrl = computed(() => {
    const product = this.product();
    const index = this.selectedImageIndex();

    if (!product?.images || product.images.length === 0) return null;

    // Handle bounds check safely
    return product.images[index]?.imageUrl || product.images[0].imageUrl;
  });

  protected placeOrder(): void {
    console.log('Placing order:', {
      productId: this.product()?.id,
      sizeId: this.selectedSizeId(),
      // color: this.selectedColor() // Disabled until backend supports it
    });
  }
}
