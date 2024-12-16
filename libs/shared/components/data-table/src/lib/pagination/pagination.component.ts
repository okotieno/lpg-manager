import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  Input,
  output,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-pagination',
  imports: [IonRow, IonSelect, IonSelectOption, IonButton, IonIcon],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {

  constructor() {
  }

  currentPageIndex = signal(0);
  pageSize = signal(0);
  startRange = computed(() =>
    Math.max(this.currentPageIndex() * this.pageSize() + 1, 1)
  );
  disabledNextButtons = computed(() => this.endRange() === this.totalItems());
  disabledPrevButtons = computed(() => this.startRange() === 1);
  paginationValueChange = output<{
    currentPage: number;
    pageSize: number;
  }>();
  selectOptions = input([10, 20, 50, 100]);
  paginationValue = input.required<{
    currentPage: 0;
    pageSize: 20;
  }>();

  paginationValueChangeEffect = effect(() => {
    const value = this.paginationValue();
    this.currentPageIndex.set(value.currentPage - 1);
    this.pageSize.set(value.pageSize);
  });

  private _totalItems = signal(0);

  endRange = computed(() =>
    Math.min(this.startRange() + this.pageSize() - 1, this._totalItems())
  );
  lastPage = computed(() => Math.ceil(this._totalItems() / this.pageSize()));

  totalItems = input.required<number>();
}
