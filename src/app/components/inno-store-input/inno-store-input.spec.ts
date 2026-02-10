import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnoStoreInput } from './inno-store-input';

describe('InnoStoreInput', () => {
  let component: InnoStoreInput;
  let fixture: ComponentFixture<InnoStoreInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnoStoreInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnoStoreInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
