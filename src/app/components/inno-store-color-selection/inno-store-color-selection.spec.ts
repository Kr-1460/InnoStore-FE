import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnoStoreColorSelection } from './inno-store-color-selection';

describe('InnoStoreColorSelection', () => {
  let component: InnoStoreColorSelection;
  let fixture: ComponentFixture<InnoStoreColorSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnoStoreColorSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnoStoreColorSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
