import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporterStoreComponent } from './transporter-store.component';

describe('TransporterStoreComponent', () => {
  let component: TransporterStoreComponent;
  let fixture: ComponentFixture<TransporterStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransporterStoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransporterStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
