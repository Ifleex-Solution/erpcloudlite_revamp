// ── Generic list response ──────────────────────────────────────────────────
export interface ProductListResponse<T> {
  status: string;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductResponse<T> {
  status: string;
  message?: string;
  data?: T;
  id?: number;
}

export interface DropdownItem {
  id: number;
  name: string;
}

export interface DropdownResponse {
  status: string;
  data: DropdownItem[];
}

export interface AllDropdownsResponse {
  status: string;
  categories: DropdownItem[];
  units: DropdownItem[];
  brands: DropdownItem[];
  oops: DropdownItem[];
  stores: DropdownItem[];
  suppliers: DropdownItem[];
}

// ── Brand ──────────────────────────────────────────────────────────────────
export interface Brand {
  id?: number;
  name: string;
  status: number | '';
}

// ── OOP ───────────────────────────────────────────────────────────────────
export interface Oop {
  id?: number;
  name: string;
  status: number | '';
}

// ── Category ──────────────────────────────────────────────────────────────
export interface Category {
  id?: number;
  name: string;
  status: number | '';
}

// ── Subcategory ───────────────────────────────────────────────────────────
export interface Subcategory {
  id?: number;
  name: string;
  category_id: number | '';
  category_name?: string;
  status: number | '';
}

// ── Unit ──────────────────────────────────────────────────────────────────
export interface Unit {
  id?: number;
  name: string;
  display_name?: string;
  status: number | '';
}

// ── Substock entry (subunit_product) ──────────────────────────────────────
export interface SubstockEntry {
  id: number;
  subunitid: number | string;
  subunit: string;
  subcost_price: number | string;
  subsell_price: number | string;
  selected: boolean;
  selectedInt: number;
}

// ── Product ───────────────────────────────────────────────────────────────
export interface ProductInfo {
  id?: number;
  code: string;
  name: string;
  category_id: number | '';
  category_name?: string;
  subcategory_id?: number | '';
  subcategory_name?: string;
  unit_id: number | '';
  unit_name?: string;
  brand_id?: number | '';
  brand_name?: string;
  oop_id?: number | '';
  product_type: string;
  serial_no?: string;
  product_model?: string;
  product_details?: string;
  printname?: string;
  store?: number | '';
  defaultsaleprice?: string;
  batchtype?: number | '';
  product_vat?: number | '';
  cost_price?: number | '';
  price?: number | '';
  supplier_id?: number | '';
  stock?: number | '';
  max_stock_level?: number | '';
  min_stock_level?: number | '';
  reorder_stock_level?: number | '';
  reserve_stock_level?: number | '';
  status: number | '';
  entries?: SubstockEntry[];
}

// ── Product Group ─────────────────────────────────────────────────────────
export interface ProductGroup {
  id?: number;
  code: string;
  name: string;
  status: number | '';
  invoice_group: number | '';
}

// ── Conversion Ratio ──────────────────────────────────────────────────────
export interface ConversionRatio {
  id?: number;
  product_id: number | '';
  product_name?: string;
  unit_id: number | '';
  unit_name?: string;
  conversion_ratio: number | '';
  status: number | '';
}
