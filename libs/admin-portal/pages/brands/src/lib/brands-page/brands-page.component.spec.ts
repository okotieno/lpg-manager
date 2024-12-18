import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandsPageComponent } from './brands-page.component';

describe('RolesPageComponent', () => {
  let component: BrandsPageComponent;
  let fixture: ComponentFixture<BrandsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
