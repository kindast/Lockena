export interface GetVaultItemsDto<T> {
  items: T[];
  total: number;
  pageSize: number;
  page: number;
}
