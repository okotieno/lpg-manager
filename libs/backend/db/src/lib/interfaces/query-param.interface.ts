export enum QueryOperatorEnum {
  Equals = 'EQUALS',
  In = 'IN',
  Contains = 'CONTAINS',
  LessThan = 'LESS_THAN',
  GreaterThan = 'GREATER_THAN',
  Between = 'BETWEEN'
}

export enum SortByDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface QueryParamsFilter {
  field: string;
  operator: QueryOperatorEnum;
  value: string;
  values: string[];
}

export interface IQueryParam {
  searchTerm?: string;
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  sortByDirection: SortByDirectionEnum;
  filters: QueryParamsFilter[];
}
