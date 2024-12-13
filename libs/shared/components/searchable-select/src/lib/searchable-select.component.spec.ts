import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableSelectComponent } from './searchable-select.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { of } from 'rxjs';

@Component({
  standalone:true,
  imports: [ReactiveFormsModule, SearchableSelectComponent],
  template: `
    <form [formGroup]="form">
      <lpg-searchable-select [service]="service" formControlName="input">
      </lpg-searchable-select>
    </form>`
})
class TestingInputComponent {
  service = {
    getSearchItems: () => of({items: [], meta: { totalItems: 0 }}),
    getById:  () => of({}),
    getItems:  () => of({items: [], meta: { totalItems: 0 }}),
  };
  form = inject(FormBuilder).group({
    params: new FormControl('Test Value')
  });
}

describe('SearchableSelectComponent', () => {
  let component: TestingInputComponent;
  let fixture: ComponentFixture<TestingInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingInputComponent],
      providers: [
        provideIonicAngular(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestingInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(true).toBe(true)
    expect(component).toBeTruthy();
  });
});
