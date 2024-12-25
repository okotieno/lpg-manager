import {
  Component,
  computed,
  effect,
  inject,
  input,
  Optional,
  Self,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
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
  IonToolbar,
} from '@ionic/angular/standalone';
import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { IQueryParamsFilter } from '@lpg-manager/types';
import { PaginatedResource } from '@lpg-manager/data-table';

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
    IonTextarea
  ],
  styleUrl: './searchable-select.component.scss',
})
export class SearchableSelectComponent<T extends { id: string }> implements ControlValueAccessor {
  #alertCtrl = inject(AlertController);
  isDisabled = signal(false);
  multiple = input(false);
  label = input('');
  labelPlacement = input('');
  fill = input('');
  itemsStore = input.required<PaginatedResource<T>>();
  helperText = input('\u00A0');
  placeholder = input('--Please Select--');
  idKey = input<keyof T>('id');
  labelKey = input<keyof T>('name' as keyof T);

  ionInfiniteScroll = viewChild(IonInfiniteScroll);
  selectModal = viewChild.required(IonModal);

  pageSize = computed(() => this.itemsStore().pageSize());
  items = computed(() => this.itemsStore().items());
  entities = computed(() => this.itemsStore().entities());
  totalAvailableElements = computed(() => this.itemsStore().totalItems());

  searchTerm = signal('');
  searchTermChangedEffect = effect(() => {
    const searchTerm = this.searchTerm();
    untracked(() => {
      this.itemsStore().searchItemsByTerm(searchTerm);
    });
  });

  selectedItems = signal<T[]>([]);
  selectedItemsActive = signal<T[]>([]);
  selectedItemsDisplayed = computed(() => {
    if (this.selectedItemsActive().length < 1) {
      return '';
    }
    return this.selectedItems()
      .map((item) => item[this.labelKey() as keyof T])
      .join('           ,');
  });

  totalItems = computed(() => this.entities().length);
  showInfiniteScroll = computed(
    () => this.totalAvailableElements() > this.totalItems()
  );
  defaultParams = signal<IQueryParamsFilter[]>([]);

  constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  onChanges?: (param: { id: string }[] | { id: string }) => void;
  onTouched?: () => void;

  writeValue(obj: { id: string }[] | { id: string }): void {
    if (obj) {
      untracked(() => {
        // this.preselectedItems = Array.isArray(obj) ? obj : [obj];
        // this.items.set(this.preselectedItems);
        // this.selectedItems.set(this.preselectedItems as T[]);
        // this.selectedItemsActive.set(this.selectedItems());
        // this.cdr.detectChanges();
      });
    }
  }

  registerOnChange(fn: (param: { id: string }[] | { id: string }) => void) {
    this.onChanges = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  compareIds = (t1: T, t2: T) => {
    return t1[this.idKey() as keyof T] === t2[this.idKey() as keyof T];
  };

  emitChange() {
    if (this.multiple()) {
      this.onChanges?.(this.selectedItems() as { id: string }[]);
    } else {
      this.onChanges?.(this.selectedItems()[0] as { id: string });
    }
  }

  selectItem(modal: IonModal) {
    this.emitChange();

    modal.isOpen = false;
    this.selectedItemsActive.set(this.selectedItems());
  }

  async loadMoreData() {
    this.itemsStore().fetchNextPage();
  }


  async removeItem($index: number) {
    const alert = await this.#alertCtrl.create({
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
