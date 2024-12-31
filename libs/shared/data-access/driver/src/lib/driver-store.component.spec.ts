import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverStoreComponent } from './driver-store.component';

describe('DriverStoreComponent', () => {
  let component: DriverStoreComponent;
  let fixture: ComponentFixture<DriverStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DriverStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
