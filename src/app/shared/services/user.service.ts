import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  user_id?:   string;
  first_name: string;
  last_name?:  string;
  logo?:       string;
  login_id?:   number;
  username:    string;
  password?:   string;
  user_type:   string | number;
  status:      number | string;
  screen:      number | string;
  startdate?:  string;
  enddate?:    string;
  temporary:   number | string;
  // joined
  fullname?:   string;
  company_name?: string;
}

export interface UserListResponse {
  status: string;
  data:   User[];
  total:  number;
}

export interface UserResponse {
  status: string;
  data:   User;
}

export interface ApiResponse {
  status:  string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiUrl}settings/userapi`;

  constructor(private http: HttpClient) {}

  list(page = 1, perPage = 10, q = ''): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.base}/list`, {
      params: { page, per_page: perPage, q },
    });
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/get/${id}`);
  }

  save(data: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/save`, data);
  }

  update(id: string, data: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/update/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/delete/${id}`, {});
  }
}
