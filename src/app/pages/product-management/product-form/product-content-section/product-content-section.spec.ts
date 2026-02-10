import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductContentSection } from './product-content-section';

describe('ProductContentSection', () => {
  let component: ProductContentSection;
  let fixture: ComponentFixture<ProductContentSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductContentSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductContentSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
