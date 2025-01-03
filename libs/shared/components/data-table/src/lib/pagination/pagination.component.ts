import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'lpg-pagination',
  imports: [IonRow, IonSelect, IonSelectOption, IonButton, IonIcon],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  parentDataTable = inject(DataTableComponent, { host: true });
  currentPage = linkedSignal(() => this.parentDataTable.store().currentPage());
  currentPageIndex = linkedSignal(() => this.currentPage() - 1);
  pageSize = linkedSignal(() => this.parentDataTable.store().pageSize());
  totalItems = computed(() => this.parentDataTable.store().totalItems());
  startRange = computed(() =>
    Math.max(this.currentPageIndex() * this.pageSize() + 1, 1)
  );
  disabledNextButtons = computed(() => this.endRange() === this.totalItems());
  disabledPrevButtons = computed(() => this.startRange() === 1);
  selectOptions = input([10, 20, 50, 100]);

  endRange = computed(() =>
    Math.min(this.startRange() + this.pageSize() - 1, this.totalItems())
  );
  lastPage = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pageSizeChanged(value: number) {
    this.parentDataTable.store().setPageSize(value);
  }

  currentPageChanged(value: number) {
    this.parentDataTable.store().setCurrentPage(value);
  }
}
