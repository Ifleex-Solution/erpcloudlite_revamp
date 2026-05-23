import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SubModule {
  id:     number;
  name:   string;
  mid:    number;
  status: number;
}

export interface Module {
  id:          number;
  name:        string;
  status:      number;
  sub_modules: SubModule[];
}

export interface ModulesResponse {
  status: string;
  data:   Module[];
}

export interface RoleListItem {
  id:               number;
  type:             string;
  permission_count: number;
}

export interface RolePermission {
  module_id:    number;
  submodule_id: number;
  create:       number;
  read:         number;
  update:       number;
  delete:       number;
}

export interface RoleDetail {
  role_name:   string;
  permissions: RolePermission[];
}

export interface ApiResponse {
  status:  string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private base = `${environment.apiUrl}settings/roleapi`;

  constructor(private http: HttpClient) {}

  modules(): Observable<ModulesResponse> {
    return this.http.get<ModulesResponse>(`${this.base}/modules`);
  }

  list(): Observable<{ status: string; data: RoleListItem[] }> {
    return this.http.get<{ status: string; data: RoleListItem[] }>(`${this.base}/list`);
  }

  getById(id: number): Observable<{ status: string; data: RoleDetail }> {
    return this.http.get<{ status: string; data: RoleDetail }>(`${this.base}/get/${id}`);
  }

  save(payload: { role_name: string; permissions: RolePermission[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/save`, payload);
  }

  update(id: number, payload: { role_name: string; permissions: RolePermission[] }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/update/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/delete/${id}`, {});
  }
}
