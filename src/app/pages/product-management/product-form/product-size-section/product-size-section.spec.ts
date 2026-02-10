import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSizeSection } from './product-size-section';

describe('ProductSizeSection', () => {
  let component: ProductSizeSection;
  let fixture: ComponentFixture<ProductSizeSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSizeSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSizeSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
