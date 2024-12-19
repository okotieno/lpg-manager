import { Signal } from '@angular/core';
import { IQueryParamsFilter, ISortByEnum } from '@lpg-manager/types';

export interface PaginatedResource<T> {
  sortBy: Signal<keyof T>;
  sortByDirection: Signal<ISortByEnum>;
  currentPage: Signal<number>;
  pageSize: Signal<number>;
  totalItems: Signal<number>;
  items: Signal<T[]>;
  searchItemsByTerm: (searchTem: string) => void;
  fetchNextPage: () => void;
  setPageSize: (size: number) => void;
  setCurrentPage(value: number): void;
  setSortBy(key: keyof T): void;
  setSortByDirection(direction: ISortByEnum): void;
  isLoading: Signal<boolean>;

  setFilters(filters: IQueryParamsFilter[]): void;
}


export interface ITableColumn<T> {
  label: string;
  key: keyof T;
  fieldType?: 'integer' | 'date' | 'uuid' | 'string';
}
