import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnoStoreChip } from './inno-store-chip';

describe('InnoStoreChip', () => {
  let component: InnoStoreChip;
  let fixture: ComponentFixture<InnoStoreChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnoStoreChip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnoStoreChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
