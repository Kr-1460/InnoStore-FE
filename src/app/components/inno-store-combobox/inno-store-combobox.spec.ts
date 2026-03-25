import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnoStoreCombobox } from './inno-store-combobox';

describe('InnoStoreCombobox', () => {
  let component: InnoStoreCombobox<any>;
  let fixture: ComponentFixture<InnoStoreCombobox<any>>;

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
