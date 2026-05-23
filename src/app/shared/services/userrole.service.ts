import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserRoleItem {
  id:        number;
  user_id:   string;
  fullname:  string;
  username:  string;
  role_type: string;
  status:    number;
}

export interface UserOption {
  user_id:  string;
  fullname: string;
  username: string;
}

export interface DropdownsResponse {
  status: string;
  data: {
    users: UserOption[];
    roles: string[];
  };
}

export interface ApiResponse {
  status:  string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  private base = `${environment.apiUrl}settings/useroleapi`;

  constructor(private http: HttpClient) {}

  list(): Observable<{ status: string; data: UserRoleItem[] }> {
    return this.http.get<{ status: string; data: UserRoleItem[] }>(`${this.base}/list`);
  }

  dropdowns(): Observable<DropdownsResponse> {
    return this.http.get<DropdownsResponse>(`${this.base}/dropdowns`);
  }

  getById(id: number): Observable<{ status: string; data: UserRoleItem }> {
    return this.http.get<{ status: string; data: UserRoleItem }>(`${this.base}/get/${id}`);
  }

  save(payload: { user_id: string; role_type: string; status: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/save`, payload);
  }

  update(id: number, payload: { status: number }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/update/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/delete/${id}`, {});
  }
}
