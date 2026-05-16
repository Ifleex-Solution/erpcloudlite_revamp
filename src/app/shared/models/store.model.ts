export interface Store {
  id?: number;
  code: string;
  name: string;
  store_nature: 'Showroom' | 'Warehouse' | 'Outlet' | '';
  auto_grn: number | '';
  auto_gdn: number | '';
  dstock: number | '';
  status: number | '';
}

export interface StoreListResponse {
  status: string;
  data: Store[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StoreResponse {
  status: string;
  message?: string;
  data?: Store;
  id?: number;
}

export interface CodeCheckResponse {
  exists: boolean;
}
