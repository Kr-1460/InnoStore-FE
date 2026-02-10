import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InnoStoreSwitcher } from './inno-store-switcher';

describe('InnoStoreSwither', () => {
  let component: InnoStoreSwitcher;
  let fixture: ComponentFixture<InnoStoreSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnoStoreSwitcher],
    }).compileComponents();

    fixture = TestBed.createComponent(InnoStoreSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
