import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableSelectComponent } from './searchable-select.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { IGetStationsQuery, StationStore } from '@lpg-manager/station-store';
import { PaginatedResource } from '@lpg-manager/data-table';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SearchableSelectComponent],
  template: ` <form [formGroup]="form">
    <lpg-searchable-select [itemsStore]="depotStore" formControlName="input">
    </lpg-searchable-select>
  </form>`,
})
class TestingInputComponent {
  depotStore = inject(StationStore) as PaginatedResource<
    NonNullable<NonNullable<IGetStationsQuery['stations']['items']>[number]>
  >;
  form = inject(FormBuilder).group({
    params: new FormControl('Test Value'),
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
