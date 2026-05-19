import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Branch,
  BranchListResponse,
  BranchResponse,
  BranchCodeResponse
} from '../models/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}branch/branchapi`;

  private castBranch(b: any): Branch {
    return {
      ...b,
      id:     b.id     != null ? +b.id     : b.id,
      status: b.status != null ? +b.status : b.status,
    };
  }

  getList(page: number, pageSize: number, search = ''): Observable<BranchListResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('search', search);
    return this.http.get<BranchListResponse>(`${this.base}/list`, { params }).pipe(
      map(res => ({ ...res, data: res.data.map(b => this.castBranch(b)) }))
    );
  }

  getById(id: number): Observable<BranchResponse> {
    return this.http.get<BranchResponse>(`${this.base}/get/${id}`).pipe(
      map(res => ({ ...res, data: res.data ? this.castBranch(res.data) : res.data }))
    );
  }

  getNextCode(): Observable<BranchCodeResponse> {
    return this.http.get<BranchCodeResponse>(`${this.base}/next_code`);
  }

  save(branch: Branch): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(`${this.base}/save`, branch);
  }

  update(id: number, branch: Branch): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(`${this.base}/update/${id}`, branch);
  }

  delete(id: number): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(`${this.base}/delete/${id}`, {});
  }

  checkCode(code: string, excludeId?: number): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(`${this.base}/check_code`, {
      code,
      excludeId: excludeId ?? null
    });
  }
}
