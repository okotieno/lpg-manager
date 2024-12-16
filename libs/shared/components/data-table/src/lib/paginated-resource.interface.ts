import { Signal } from '@angular/core';

export interface PaginatedResource<T> {
  currentPage: Signal<number>;
  pageSize: Signal<number>;
  totalItems: Signal<number>;
  items: Signal<T[]>;
  searchItemsByTerm: (searchTem: string) => void;
  fetchNextPage: () => void;
}
