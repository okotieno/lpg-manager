import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleStoreComponent } from './vehicle-store.component';

describe('VehicleStoreComponent', () => {
  let component: VehicleStoreComponent;
  let fixture: ComponentFixture<VehicleStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
