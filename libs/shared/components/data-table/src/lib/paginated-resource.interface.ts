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

  setSearchTerm(value: string): void;

  deleteItemWithId(id: string): void

  entities: Signal<T[]>;
}


 interface ITableColumn1<T> {
   label: string;
   key: keyof T;
   fieldType?: 'enum';
   enumList: { label: string; value: string }[];
 }

interface ITableColumn2<T> {
  label: string;
  key: keyof T;
  fieldType?: 'integer' | 'date' | 'uuid' | 'string';
}


export type ITableColumn<T> = ITableColumn1<T> | ITableColumn2<T>;

