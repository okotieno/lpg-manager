import { ComponentFixture, TestBed } from '@angular/core/testing';
import TransporterPageComponent from './transporter-page.component';

describe('RolesPageComponent', () => {
  let component: TransporterPageComponent;
  let fixture: ComponentFixture<TransporterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransporterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransporterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
