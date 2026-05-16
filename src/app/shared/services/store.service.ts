import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Store,
  StoreListResponse,
  StoreResponse,
  CodeCheckResponse
} from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}store/storeapi`;

  private castStore(store: any): Store {
    return {
      ...store,
      id:          store.id          != null ? +store.id          : store.id,
      auto_grn:    store.auto_grn    != null ? +store.auto_grn    : store.auto_grn,
      auto_gdn:    store.auto_gdn    != null ? +store.auto_gdn    : store.auto_gdn,
      dstock:      store.dstock      != null ? +store.dstock      : store.dstock,
      status:      store.status      != null ? +store.status      : store.status,
    };
  }

  getList(page: number, pageSize: number, search: string = ''): Observable<StoreListResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('search', search);
    return this.http.get<StoreListResponse>(`${this.base}/list`, { params }).pipe(
      map(res => ({ ...res, data: res.data.map(s => this.castStore(s)) }))
    );
  }

  getById(id: number): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(`${this.base}/get/${id}`).pipe(
      map(res => ({ ...res, data: res.data ? this.castStore(res.data) : res.data }))
    );
  }

  save(store: Store): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(`${this.base}/save`, store);
  }

  update(id: number, store: Store): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(`${this.base}/update/${id}`, store);
  }

  delete(id: number): Observable<StoreResponse> {
    return this.http.post<StoreResponse>(`${this.base}/delete/${id}`, {});
  }

  checkCode(code: string, excludeId?: number): Observable<CodeCheckResponse> {
    return this.http.post<CodeCheckResponse>(`${this.base}/check_code`, {
      code,
      excludeId: excludeId ?? null
    });
  }
}
