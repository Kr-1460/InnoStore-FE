import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorSection } from './product-color-section';

describe('ProductColorSection', () => {
  let component: ProductColorSection;
  let fixture: ComponentFixture<ProductColorSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductColorSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductColorSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
