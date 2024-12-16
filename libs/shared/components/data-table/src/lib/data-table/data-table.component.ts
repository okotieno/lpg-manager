import { Component, computed, input } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import {
  ITableColumn,
  PaginatedResource,
} from '../paginated-resource.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { IQueryOperatorEnum, ISortByEnum } from '@lpg-manager/types';

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
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> {
  searchOptions = [
    { label: 'Contains', value: IQueryOperatorEnum.Contains },
    { label: 'Equals', value: IQueryOperatorEnum.Equals },
    { label: 'Less than;', value: IQueryOperatorEnum.LessThan },
    { label: 'Greater than', value: IQueryOperatorEnum.GreaterThan },
    { label: 'In', value: IQueryOperatorEnum.In },
    { label: 'Between', value: IQueryOperatorEnum.Between },
  ];
  pageTitle = input<string>();
  createNewIcon = input<string>('plus');
  store = input.required<PaginatedResource<T>>();
  columns = input<ITableColumn<T>[]>([
    { label: 'id', key: 'id' as keyof T },
    { label: 'name', key: 'name' as keyof T },
  ]);
  mappedColumns = computed(() => this.columns().map(item => ({ ...item, key: String(item['key']) })));
  displayedColumns = computed(() => [...this.mappedColumns().map(({ key }) => key), 'actions']);
  items = computed(() => this.store().items());
  sortBy = computed(() => this.store().sortBy());
  sortByDirection = computed(() => this.store().sortByDirection());

  changeSort(key: keyof T) {
    if (key !== this.sortBy()) {
      this.store().setSortByDirection(ISortByEnum.Asc)
    } else {
      this.store().setSortByDirection(
        this.sortByDirection() === ISortByEnum.Asc ? ISortByEnum.Desc : ISortByEnum.Asc
      );
    }
    this.store().setSortBy(key)
  }
}
