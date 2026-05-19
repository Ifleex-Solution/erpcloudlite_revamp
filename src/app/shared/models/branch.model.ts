export interface Branch {
  id?: number;
  code: string;
  name: string;
  nature: 'Retail' | 'Wholesale' | '';
  status: number | '';
}

export interface BranchListResponse {
  status: string;
  data: Branch[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BranchResponse {
  status: string;
  message?: string;
  data?: Branch;
  id?: number;
}

export interface BranchCodeResponse {
  status: string;
  code: string;
}
