import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispatchStoreComponent } from './dispatch-store.component';

describe('DispatchStoreComponent', () => {
  let component: DispatchStoreComponent;
  let fixture: ComponentFixture<DispatchStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
