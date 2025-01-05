import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerInputComponent } from './scanner-input.component';

describe('BreadcrumbComponent', () => {
  let component: ScannerInputComponent;
  let fixture: ComponentFixture<ScannerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
