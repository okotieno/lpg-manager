import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  Optional,
  Self,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
// import { CrudService } from '@furaha/frontend/list-page';
import { IQueryParamsFilter } from '@lpg-manager/types';
import { debounceTime, EMPTY, Observable, take, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IGetPermissionsQuery, IGetPermissionsQueryVariables } from '@lpg-manager/permission-store';
import { QueryOptionsAlone } from 'apollo-angular/types';
import { ApolloQueryResult } from '@apollo/client';

@Component({
  selector: 'lpg-searchable-select',
  templateUrl: './searchable-select.component.html',
  imports: [
    IonIcon,
    IonModal,
    FormsModule,
    IonButton,
    IonHeader,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonList,
    CdkListbox,
    CdkOption,
    IonFooter,
    IonRow,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonTextarea,
    IonChip
  ],
  styleUrl: './searchable-select.component.scss',
})
export class SearchableSelectComponent<T> implements ControlValueAccessor {
  helperText = input('\u00A0');
  selectModal = viewChild.required(IonModal);
  alertCtrl = inject(AlertController);
  pageSize = input(10);
  cdr = inject(ChangeDetectorRef);
  searchTerm = signal('');
  searchTermChanged = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(500))
  );
  searchTermChangedEffect = effect(() => {
    this.searchTermChanged();
    untracked(() => {
      this.currentPage.set(1);
      this.fetchItems();
    });
  });
  isDisabled = signal(false);
  multiple = input(false);
  label = input('');
  labelPlacement = input('');
  fill = input('');
  placeholder = input('--Please Select--');
  // service = input<CrudService<T>>();
  service =
    input<
      (
        variables?: IGetPermissionsQueryVariables,
        options?: QueryOptionsAlone<
          IGetPermissionsQueryVariables,
          IGetPermissionsQuery
        >
      ) => Observable<ApolloQueryResult<IGetPermissionsQuery>>
    >();
  idKey = input<number | string>('id');
  labelKey = input<number | string>('name');
  preselectedItems: { id: number }[] = [];
  items = signal<Record<string | number, string | number>[]>([]);
  selectedItems = signal<T[]>([]);
  selectedItemsActive = signal<T[]>([]);
  selectedItemsDisplayed = computed(() => {
    // if (this.selectedItemsActive().length < 1) {
    //   return '--Please Select--';
    // }
    return this.selectedItems()
      .map((item) => item[this.labelKey() as keyof T])
      .join('           ,');
  });
  ionInfiniteScroll = viewChild(IonInfiniteScroll);
  totalItems = computed(() => this.items().length);
  totalAvailableElements = signal(0);
  showInfiniteScroll = computed(
    () => this.totalAvailableElements() > this.totalItems()
  );
  currentPage = signal(1);
  defaultParams = signal<IQueryParamsFilter[]>([]);

  constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  onChanges?: (param: { id: number }[] | { id: number }) => void;
  onTouched?: () => void;

  writeValue(obj: { id: number }[] | { id: number }): void {
    if (obj) {
      untracked(() => {
        this.preselectedItems = Array.isArray(obj) ? obj : [obj];
        this.items.set(this.preselectedItems);
        this.selectedItems.set(this.preselectedItems as T[]);
        this.selectedItemsActive.set(this.selectedItems());
        this.cdr.detectChanges();
      });
    }
  }

  registerOnChange(fn: (param: { id: number }[] | { id: number }) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  fetchItems() {
    const searchTerm = this.searchTerm();
    const currentPage = this.currentPage();
    const pageSize = this.pageSize();
    const defaultParams = this.defaultParams();
    if (!this.service()) {
      return EMPTY;
    }
    return this.service()?.({
      query: {
        searchTerm: searchTerm ?? '',
        currentPage: currentPage ?? 1,
        pageSize: pageSize ?? 20,
        filters: defaultParams ?? [],
      },
    })
      .pipe(
        tap((res: any) => {
          if (res?.items) {
            this.totalAvailableElements.set(res?.meta?.totalItems ?? 0);
            if (this.currentPage() <= 1) {
              this.items.set([
                ...this.preselectedItems,
                ...(res.items as Record<string, string>[]),
              ]);
            } else {
              this.items.update((items) => [
                ...items,
                ...(res.items as Record<string, string>[]),
              ]);
            }
            this.items.set(
              this.items().sort((a, b) => (a['name'] < b['name'] ? -1 : 1))
            );
            const uniqueData = [];
            const idSet = new Set();

            for (const item of this.items()) {
              if (!idSet.has(item['id'])) {
                idSet.add(item['id']);
                uniqueData.push(item);
              }
            }

            this.items.set([...uniqueData]);
          }

          this.ionInfiniteScroll()?.complete().then();
        }),
        take(1)
      )
      .subscribe();
  }

  compareIds = (t1: T, t2: T) => {
    return t1[this.idKey() as keyof T] === t2[this.idKey() as keyof T];
  };

  emitChange() {
    if (this.multiple()) {
      this.onChanges?.(this.selectedItems() as { id: number }[]);
    } else {
      this.onChanges?.(this.selectedItems()[0] as { id: number });
    }
  }

  selectItem(modal: IonModal) {
    this.emitChange();

    modal.isOpen = false;
    this.preselectedItems = this.selectedItems() as { id: number }[];
    this.selectedItemsActive.set(this.selectedItems());
  }

  async loadMoreData() {
    this.currentPage.update((current) => current + 1);
    this.fetchItems();
  }

  async loadInitialData() {
    this.currentPage.set(1);
    this.searchTerm.set('');
    this.fetchItems();
  }

  async removeItem($index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Removing Item',
      message: 'You are removing Item, continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes Continue',
          role: 'destructive',
          handler: () => {
            this.selectedItems.update((items) => {
              const originalItems = [...items];
              originalItems.splice($index, 1);
              return originalItems;
            });
            this.selectedItemsActive.set(this.selectedItems());
            this.emitChange();
          },
        },
      ],
    });

    await alert.present();
  }

  async closeModal() {
    await this.selectModal().dismiss();
    this.selectedItems.set(this.selectedItemsActive());
  }
}