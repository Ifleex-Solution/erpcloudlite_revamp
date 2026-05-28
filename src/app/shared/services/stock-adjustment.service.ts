import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockAdjustmentService {
  private base = `${environment.apiUrl}stock/stockapi`;

  constructor(private http: HttpClient) {}

  list(page: number, pageSize: number, search: string, fdate: string, tdate: string): Observable<any> {
    const params = new HttpParams()
      .set('page', page).set('pageSize', pageSize)
      .set('search', search).set('fdate', fdate).set('tdate', tdate);
    return this.http.get<any>(`${this.base}/adjustment/list`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/adjustment/${id}`);
  }

  save(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/adjustment/save`, payload);
  }

  update(id: number, payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/adjustment/update/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/adjustment/delete/${id}`, {});
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.base}/products`);
  }

  getStores(): Observable<any> {
    return this.http.get<any>(`${this.base}/stores`);
  }

  getBatches(productId: number, batchtype: number): Observable<any> {
    const params = new HttpParams().set('product_id', productId).set('batchtype', batchtype);
    return this.http.get<any>(`${this.base}/batches`, { params });
  }

  getSubunits(productId: number): Observable<any> {
    const params = new HttpParams().set('product_id', productId);
    return this.http.get<any>(`${this.base}/subunits`, { params });
  }

  getAvStock(productId: number, storeId: number, batchId: number | string, stocktype: string): Observable<any> {
    const params = new HttpParams()
      .set('product_id', productId).set('store_id', storeId)
      .set('batch_id', batchId).set('stocktype', stocktype);
    return this.http.get<any>(`${this.base}/avstock`, { params });
  }

  getConversion(productId: number, unitId: number): Observable<any> {
    const params = new HttpParams().set('product_id', productId).set('unit_id', unitId);
    return this.http.get<any>(`${this.base}/conversion`, { params });
  }
}
