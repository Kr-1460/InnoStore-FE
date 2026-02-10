import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnoStoreCombobox } from './inno-store-combobox';

describe('InnoStoreCombobox', () => {
  let component: InnoStoreCombobox;
  let fixture: ComponentFixture<InnoStoreCombobox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnoStoreCombobox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnoStoreCombobox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
