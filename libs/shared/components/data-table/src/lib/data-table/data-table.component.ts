import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPopover,
  IonRow, IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import {
  ITableColumn,
  PaginatedResource,
} from '../paginated-resource.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { IQueryOperatorEnum, ISortByEnum } from '@lpg-manager/types';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { validate as isValidUUID } from 'uuid';

const validateUUID = (control: AbstractControl) => {
  if(isValidUUID(control.value)) {
    return null;
  }
  return { uuid: 'Invalid UUID' };
}

@Component({
  selector: 'lpg-data-table',
  standalone: true,
  imports: [
    CdkTableModule,
    IonText,
    IonButton,
    RouterLink,
    IonIcon,
    TitleCasePipe,
    PaginationComponent,
    IonSkeletonText,
    IonRow,
    IonPopover,
    IonContent,
    IonSelect,
    ReactiveFormsModule,
    IonCol,
    IonInput,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> {
  popover = viewChild.required(IonPopover);
  #alertCtrl = inject(AlertController);
  pageTitle = input<string>();
  createNewIcon = input<string>('plus');
  createNewLabel = input<string>('New');
  store = input.required<PaginatedResource<T>>();
  columns = input<ITableColumn<T>[]>([
    { label: 'id', key: 'id' as keyof T, fieldType: 'uuid' },
    { label: 'name', key: 'name' as keyof T },
  ]);

  displayedSearchOptions = computed(() => {
    const columns = this.columns();
    const searchOptions = [
      { label: 'Contains', value: IQueryOperatorEnum.Contains },
      { label: 'Equals', value: IQueryOperatorEnum.Equals },
      { label: 'Less than', value: IQueryOperatorEnum.LessThan },
      { label: 'Greater than', value: IQueryOperatorEnum.GreaterThan },
      { label: 'In', value: IQueryOperatorEnum.In },
      { label: 'Between', value: IQueryOperatorEnum.Between },
    ];
    const fieldTypesSearchOptions = {
      [IQueryOperatorEnum.Contains]: ['date', 'integer', 'string'],
      [IQueryOperatorEnum.Equals]: ['date', 'integer', 'string', 'uuid'],
      [IQueryOperatorEnum.In]: ['date', 'integer', 'string', 'uuid'],
      [IQueryOperatorEnum.GreaterThan]: ['date', 'integer', 'string'],
      [IQueryOperatorEnum.LessThan]: ['date', 'integer', 'string'],
      [IQueryOperatorEnum.Between]: ['date', 'integer', 'string'],
    };

    return columns.reduce((acc, column) => {
      const allowedOperators = Object.keys(fieldTypesSearchOptions).filter(
        (operator) =>
          fieldTypesSearchOptions[operator as IQueryOperatorEnum].includes(
            column.fieldType ?? 'string'
          )
      );

      acc[column.key as string] = searchOptions.filter((option) =>
        allowedOperators.includes(option.value)
      );
      return acc;
    }, {} as { [key: string]: { label: string; value: string }[] });
  });
  columnsChangedEffect = effect(() => {
    this.columns();
    untracked(() => {
      this.#resetFormSearchControls();
    });
  });
  mappedColumns = computed(() =>
    this.columns().map((item) => ({ ...item, key: String(item['key']) }))
  );
  displayedColumns = computed(() => [
    ...this.mappedColumns().map(({ key }) => key),
    'actions',
  ]);
  items = computed(() => {
    if (this.isLoading()) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
        (id) => ({ id: String(id) } as T)
      );
    } else {
      return this.store().items();
    }
  });
  sortBy = computed(() => this.store().sortBy());
  sortByDirection = computed(() => this.store().sortByDirection());
  isLoading = computed(() => this.store().isLoading());

  filtersTracker: WritableSignal<{ [K in keyof T]: string[] }> = signal(
    {} as { [K in keyof T]: string[] }
  );
  #prevFilterTracker: string[] = [];
  #prevSearchFormValue: { value: string; operator: IQueryOperatorEnum }[] = [];
  prevSearchFormValue: { value: string; operator: IQueryOperatorEnum }[] = [];
  fb = inject(FormBuilder);
  searchForm: FormGroup<{
    [key: string]: FormArray<
      FormGroup<{
        value?: FormControl<string>;
        operator?: FormControl<IQueryOperatorEnum>;
      }>
    >;
  }> = this.fb.group({});
  filterIsOpen = signal<boolean>(false);
  activeFilterKey = signal<keyof T>('id' as keyof T);
  activeFilterTracker = computed(
    () => this.filtersTracker()[this.activeFilterKey()]
  );
  activeColumn = computed(
    () =>
      this.columns().find(
        ({ key }) => key === this.activeFilterKey()
      ) as ITableColumn<T>
  );

  searchOptions = computed(
    () => this.displayedSearchOptions()[this.activeColumn().key as string]
  );

  get filters() {
    const transformed = [];
    for (const [field, items] of Object.entries(this.searchForm.value)) {
      if (items?.length && items.length > 0) {
        for (const { operator, value } of items) {
          transformed.push({
            field,
            operator,
            value,
            values: [],
          });
        }
      }
    }
    return transformed;
  }

  openFilterPopover(key: keyof T, $event: MouseEvent) {
    this.activeFilterKey.set(key);
    const filtersTracker = { ...this.filtersTracker() };
    if (!filtersTracker[key]) {
      filtersTracker[key] = [];
    }
    this.#prevFilterTracker = [...filtersTracker[key]];
    this.#prevSearchFormValue = this.searchForm.get(key as string)?.value ?? [];
    this.prevSearchFormValue = this.searchForm.get(key as string)?.value ?? [];
    if (filtersTracker[key].length < 1) {
      this.addFilter(key);
    }
    this.popover().event = $event;
    this.filterIsOpen.set(true);
  }

  addFilter(key: keyof T) {
    const fieldType = this.columns().filter(
      ({ key: keyValue }) => keyValue === key
    )[0].fieldType;
    const validators = [Validators.required];
    if (fieldType === 'uuid') {
      validators.push(validateUUID);
    }
    (this.searchForm.get(key as string) as FormArray).push(
      this.fb.group({
        operator: [
          ['uuid', 'integer'].includes(fieldType as string)
            ? IQueryOperatorEnum.Equals
            : IQueryOperatorEnum.Contains,
        ],
        value: ['', validators],
      })
    );
    const filtersTracker = { ...this.filtersTracker() };
    if (!filtersTracker[key]) {
      filtersTracker[key] = [];
    }
    filtersTracker[key].push(`${key as string}-${Math.random()}`);
    this.filtersTracker.set(filtersTracker);
  }

  removeFilter(key: keyof T, filterIndex: number) {
    const filtersTracker = { ...this.filtersTracker() };
    filtersTracker[key].splice(filterIndex, 1);
    (this.searchForm.get(key as string) as FormArray).removeAt(filterIndex);
    this.filtersTracker.set(filtersTracker);

    if (this.filters.length === 0) {
      console.log(this.filters);
    }
  }

  #resetFormSearchControls() {
    const columns: ITableColumn<T>[] = this.columns();
    const controlNames = Object.keys(this.searchForm.controls);
    controlNames.forEach((controlName) => {
      (this.searchForm as FormGroup).removeControl(controlName);
    });
    columns.forEach((controlName) => {
      (this.searchForm as FormGroup).addControl(
        String(controlName.key),
        this.fb.array([])
      );
    });
  }

  changeSort(key: keyof T) {
    if (key !== this.sortBy()) {
      this.store().setSortByDirection(ISortByEnum.Asc);
    } else {
      this.store().setSortByDirection(
        this.sortByDirection() === ISortByEnum.Asc
          ? ISortByEnum.Desc
          : ISortByEnum.Asc
      );
    }
    this.store().setSortBy(key);
  }

  async confirmRemoveSearchField(key: keyof T, filterIndex: number) {
    const alert = await this.#alertCtrl.create({
      header: 'Confirmation',
      message: 'You are removing a search field, continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Continue',
          role: 'confirm',
          cssClass: 'alert-button-danger',
          handler: () => {
            this.removeFilter(key, filterIndex);
          },
        },
      ],
    });

    await alert.present();
  }

  applyFilters() {
    this.store().setFilters(this.filters);
    this.filterIsOpen.set(false);
  }

  closeSearchDialog($event: CustomEvent) {
    if ($event.detail.role === 'backdrop' || $event.detail.role === 'close') {
      // Reset filters tracker
      const filtersTracker = { ...this.filtersTracker() };
      filtersTracker[this.activeFilterKey()] = [...this.#prevFilterTracker];
      this.filtersTracker.set(filtersTracker);

      // Reset form array with previous values
      const formArray = this.searchForm.get(
        this.activeFilterKey() as string
      ) as FormArray;
      while (formArray.length) {
        formArray.removeAt(0);
      }

      this.#prevSearchFormValue.forEach(({ operator, value }) => {
        formArray.push(
          this.fb.group({
            operator: [operator],
            value: [
              value,
              this.activeColumn().fieldType === 'uuid'
                ? [Validators.required, validateUUID]
                : [Validators.required],
            ],
          })
        );
      });
    }
    this.filterIsOpen.set(false);
  }

  clearSearch() {
    const filtersTracker = { ...this.filtersTracker() };
    filtersTracker[this.activeFilterKey()] = [];
    this.filtersTracker.set(filtersTracker);

    // Reset form array with previous values
    const formArray = this.searchForm.get(
      this.activeFilterKey() as string
    ) as FormArray;
    while (formArray.length) {
      formArray.removeAt(0);
    }
  }
  async confirmClearSearch() {
    const alert = await this.#alertCtrl.create({
      header: 'Confirmation',
      message: 'You are about to clear search field, continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Continue',
          role: 'confirm',
          cssClass: 'alert-button-danger',
          handler: () => {
            this.clearSearch();
          },
        },
      ],
    });

    await alert.present();
  }

  handleSearch($event: CustomEvent) {
    this.store().setSearchTerm($event.detail.value);
  }
}
