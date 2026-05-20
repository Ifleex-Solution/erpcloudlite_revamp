import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProductListResponse, ProductResponse, DropdownResponse, AllDropdownsResponse,
  Brand, Oop, Category, Subcategory, Unit, ProductInfo, ProductGroup, ConversionRatio,
  SubstockEntry
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = `${environment.apiUrl}product/productapi`;

  constructor(private http: HttpClient) {}

  // ── BRAND ────────────────────────────────────────────────────────────────
  getBrands(page: number, pageSize: number, search: string): Observable<ProductListResponse<Brand>> {
    return this.http.get<ProductListResponse<Brand>>(`${this.base}/brand/list`, { params: { page, pageSize, search } });
  }
  getBrand(id: number): Observable<ProductResponse<Brand>> {
    return this.http.get<ProductResponse<Brand>>(`${this.base}/brand/get/${id}`);
  }
  saveBrand(data: Brand): Observable<ProductResponse<Brand>> {
    return this.http.post<ProductResponse<Brand>>(`${this.base}/brand/save`, { brand_name: data.name, status: data.status });
  }
  updateBrand(id: number, data: Brand): Observable<ProductResponse<Brand>> {
    return this.http.post<ProductResponse<Brand>>(`${this.base}/brand/update/${id}`, { brand_name: data.name, status: data.status });
  }
  deleteBrand(id: number): Observable<ProductResponse<Brand>> {
    return this.http.post<ProductResponse<Brand>>(`${this.base}/brand/delete/${id}`, {});
  }

  // ── OOP ──────────────────────────────────────────────────────────────────
  getOops(page: number, pageSize: number, search: string): Observable<ProductListResponse<Oop>> {
    return this.http.get<ProductListResponse<Oop>>(`${this.base}/oop/list`, { params: { page, pageSize, search } });
  }
  getOop(id: number): Observable<ProductResponse<Oop>> {
    return this.http.get<ProductResponse<Oop>>(`${this.base}/oop/get/${id}`);
  }
  saveOop(data: Oop): Observable<ProductResponse<Oop>> {
    return this.http.post<ProductResponse<Oop>>(`${this.base}/oop/save`, { oop_name: data.name, status: data.status });
  }
  updateOop(id: number, data: Oop): Observable<ProductResponse<Oop>> {
    return this.http.post<ProductResponse<Oop>>(`${this.base}/oop/update/${id}`, { oop_name: data.name, status: data.status });
  }
  deleteOop(id: number): Observable<ProductResponse<Oop>> {
    return this.http.post<ProductResponse<Oop>>(`${this.base}/oop/delete/${id}`, {});
  }

  // ── CATEGORY ─────────────────────────────────────────────────────────────
  getCategories(page: number, pageSize: number, search: string): Observable<ProductListResponse<Category>> {
    return this.http.get<ProductListResponse<Category>>(`${this.base}/category/list`, { params: { page, pageSize, search } });
  }
  getCategory(id: number): Observable<ProductResponse<Category>> {
    return this.http.get<ProductResponse<Category>>(`${this.base}/category/get/${id}`);
  }
  saveCategory(data: Category): Observable<ProductResponse<Category>> {
    return this.http.post<ProductResponse<Category>>(`${this.base}/category/save`, { category_name: data.name, status: data.status });
  }
  updateCategory(id: number, data: Category): Observable<ProductResponse<Category>> {
    return this.http.post<ProductResponse<Category>>(`${this.base}/category/update/${id}`, { category_name: data.name, status: data.status });
  }
  deleteCategory(id: number): Observable<ProductResponse<Category>> {
    return this.http.post<ProductResponse<Category>>(`${this.base}/category/delete/${id}`, {});
  }

  // ── SUBCATEGORY ──────────────────────────────────────────────────────────
  getSubcategories(page: number, pageSize: number, search: string): Observable<ProductListResponse<Subcategory>> {
    return this.http.get<ProductListResponse<Subcategory>>(`${this.base}/subcategory/list`, { params: { page, pageSize, search } });
  }
  getSubcategory(id: number): Observable<ProductResponse<Subcategory>> {
    return this.http.get<ProductResponse<Subcategory>>(`${this.base}/subcategory/get/${id}`);
  }
  saveSubcategory(data: Subcategory): Observable<ProductResponse<Subcategory>> {
    return this.http.post<ProductResponse<Subcategory>>(`${this.base}/subcategory/save`, { subcategory_name: data.name, category_id: data.category_id, status: data.status });
  }
  updateSubcategory(id: number, data: Subcategory): Observable<ProductResponse<Subcategory>> {
    return this.http.post<ProductResponse<Subcategory>>(`${this.base}/subcategory/update/${id}`, { subcategory_name: data.name, category_id: data.category_id, status: data.status });
  }
  deleteSubcategory(id: number): Observable<ProductResponse<Subcategory>> {
    return this.http.post<ProductResponse<Subcategory>>(`${this.base}/subcategory/delete/${id}`, {});
  }

  // ── UNIT ─────────────────────────────────────────────────────────────────
  getUnits(page: number, pageSize: number, search: string): Observable<ProductListResponse<Unit>> {
    return this.http.get<ProductListResponse<Unit>>(`${this.base}/unit/list`, { params: { page, pageSize, search } });
  }
  getUnit(id: number): Observable<ProductResponse<Unit>> {
    return this.http.get<ProductResponse<Unit>>(`${this.base}/unit/get/${id}`);
  }
  saveUnit(data: Unit): Observable<ProductResponse<Unit>> {
    return this.http.post<ProductResponse<Unit>>(`${this.base}/unit/save`, { unit_name: data.name, unit_display_name: data.display_name, status: data.status });
  }
  updateUnit(id: number, data: Unit): Observable<ProductResponse<Unit>> {
    return this.http.post<ProductResponse<Unit>>(`${this.base}/unit/update/${id}`, { unit_name: data.name, unit_display_name: data.display_name, status: data.status });
  }
  deleteUnit(id: number): Observable<ProductResponse<Unit>> {
    return this.http.post<ProductResponse<Unit>>(`${this.base}/unit/delete/${id}`, {});
  }

  // ── PRODUCT ──────────────────────────────────────────────────────────────
  getProducts(page: number, pageSize: number, search: string): Observable<ProductListResponse<ProductInfo>> {
    return this.http.get<ProductListResponse<ProductInfo>>(`${this.base}/product/list`, { params: { page, pageSize, search } });
  }
  getProduct(id: number): Observable<ProductResponse<ProductInfo>> {
    return this.http.get<ProductResponse<ProductInfo>>(`${this.base}/product/get/${id}`);
  }
  getProductNextCode(): Observable<{ status: string; code: string }> {
    return this.http.get<{ status: string; code: string }>(`${this.base}/product/next_code`);
  }
  saveProduct(data: ProductInfo, entries: SubstockEntry[]): Observable<ProductResponse<ProductInfo>> {
    return this.http.post<ProductResponse<ProductInfo>>(`${this.base}/product/save`, {
      product_id: data.code, product_name: data.name, category_id: data.category_id,
      subcategory_id: data.subcategory_id, unit: data.unit_id, brand_id: data.brand_id,
      oop_id: data.oop_id, product_type: data.product_type, status: data.status,
      serial_no: data.serial_no, product_model: data.product_model,
      product_details: data.product_details, printname: data.printname,
      store: data.store, defaultsaleprice: data.defaultsaleprice,
      batchtype: data.batchtype, product_vat: data.product_vat,
      cost_price: data.cost_price, price: data.price,
      supplier_id: data.supplier_id, stock: data.stock,
      max_stock_level: data.max_stock_level, min_stock_level: data.min_stock_level,
      reorder_stock_level: data.reorder_stock_level, reserve_stock_level: data.reserve_stock_level,
      entries,
    });
  }
  updateProduct(id: number, data: ProductInfo, entries: SubstockEntry[]): Observable<ProductResponse<ProductInfo>> {
    return this.http.post<ProductResponse<ProductInfo>>(`${this.base}/product/update/${id}`, {
      product_name: data.name, category_id: data.category_id, subcategory_id: data.subcategory_id,
      unit: data.unit_id, brand_id: data.brand_id, oop_id: data.oop_id,
      product_type: data.product_type, status: data.status,
      serial_no: data.serial_no, product_model: data.product_model,
      product_details: data.product_details, printname: data.printname,
      store: data.store, defaultsaleprice: data.defaultsaleprice,
      batchtype: data.batchtype, product_vat: data.product_vat,
      cost_price: data.cost_price, price: data.price,
      supplier_id: data.supplier_id, stock: data.stock,
      max_stock_level: data.max_stock_level, min_stock_level: data.min_stock_level,
      reorder_stock_level: data.reorder_stock_level, reserve_stock_level: data.reserve_stock_level,
      entries,
    });
  }
  deleteProduct(id: number): Observable<ProductResponse<ProductInfo>> {
    return this.http.post<ProductResponse<ProductInfo>>(`${this.base}/product/delete/${id}`, {});
  }
  deleteSubunit(id: number): Observable<any> {
    return this.http.post(`${this.base}/subunit/delete/${id}`, {});
  }

  // ── PRODUCT GROUP ─────────────────────────────────────────────────────────
  getProductGroups(page: number, pageSize: number, search: string): Observable<ProductListResponse<ProductGroup>> {
    return this.http.get<ProductListResponse<ProductGroup>>(`${this.base}/productgroup/list`, { params: { page, pageSize, search } });
  }
  getProductGroup(id: number): Observable<ProductResponse<ProductGroup>> {
    return this.http.get<ProductResponse<ProductGroup>>(`${this.base}/productgroup/get/${id}`);
  }
  getProductGroupNextCode(): Observable<{ status: string; code: string }> {
    return this.http.get<{ status: string; code: string }>(`${this.base}/productgroup/next_code`);
  }
  saveProductGroup(data: ProductGroup): Observable<ProductResponse<ProductGroup>> {
    return this.http.post<ProductResponse<ProductGroup>>(`${this.base}/productgroup/save`, { groupcode: data.code, name: data.name, status: data.status, invoice_group: data.invoice_group });
  }
  updateProductGroup(id: number, data: ProductGroup): Observable<ProductResponse<ProductGroup>> {
    return this.http.post<ProductResponse<ProductGroup>>(`${this.base}/productgroup/update/${id}`, { name: data.name, status: data.status, invoice_group: data.invoice_group });
  }
  deleteProductGroup(id: number): Observable<ProductResponse<ProductGroup>> {
    return this.http.post<ProductResponse<ProductGroup>>(`${this.base}/productgroup/delete/${id}`, {});
  }

  // ── CONVERSION RATIO ──────────────────────────────────────────────────────
  getConversionRatios(page: number, pageSize: number, search: string): Observable<ProductListResponse<ConversionRatio>> {
    return this.http.get<ProductListResponse<ConversionRatio>>(`${this.base}/conversionratio/list`, { params: { page, pageSize, search } });
  }
  getConversionRatio(id: number): Observable<ProductResponse<ConversionRatio>> {
    return this.http.get<ProductResponse<ConversionRatio>>(`${this.base}/conversionratio/get/${id}`);
  }
  saveConversionRatio(data: ConversionRatio): Observable<ProductResponse<ConversionRatio>> {
    return this.http.post<ProductResponse<ConversionRatio>>(`${this.base}/conversionratio/save`, { product: data.product_id, subunit: data.unit_id, conversion_ratio: data.conversion_ratio, status: data.status });
  }
  updateConversionRatio(id: number, data: ConversionRatio): Observable<ProductResponse<ConversionRatio>> {
    return this.http.post<ProductResponse<ConversionRatio>>(`${this.base}/conversionratio/update/${id}`, { conversion_ratio: data.conversion_ratio, status: data.status });
  }
  deleteConversionRatio(id: number): Observable<ProductResponse<ConversionRatio>> {
    return this.http.post<ProductResponse<ConversionRatio>>(`${this.base}/conversionratio/delete/${id}`, {});
  }

  // ── DROPDOWNS ─────────────────────────────────────────────────────────────
  getAllDropdowns(): Observable<AllDropdownsResponse> {
    return this.http.get<AllDropdownsResponse>(`${this.base}/dropdowns/all`);
  }
  getAllCategories(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/categories/all`);
  }
  getSubcategoriesByCategory(categoryId: number): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/subcategories/by-category/${categoryId}`);
  }
  getAllUnits(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/units/all`);
  }
  getAllBrands(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/brands/all`);
  }
  getAllOops(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/oops/all`);
  }
  getAllProducts(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/products/all`);
  }
  getAllStores(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/stores/all`);
  }
  getAllSuppliers(): Observable<DropdownResponse> {
    return this.http.get<DropdownResponse>(`${this.base}/suppliers/all`);
  }
}
