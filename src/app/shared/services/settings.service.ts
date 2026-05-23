import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Company {
  company_id?:     number;
  company_name:    string;
  mobile:          string;
  address:         string;
  email?:          string;
  website?:        string;
  vat_no?:         string;
  cr_no?:          string;
  footer_text?:    string;
  password?:       string;
  instance_type?:  string;
  password_enable: number | '';
  status:          number | '';
  theme_color?:    string;
  theme_dark?:     number;
}

export interface CompanyListResponse {
  status: string;
  data:   Company[];
  total:  number;
}

export interface CompanyResponse {
  status: string;
  data:   Company;
}

export interface ApiResponse {
  status:  string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private base = `${environment.apiUrl}settings/settingsapi`;

  constructor(private http: HttpClient) {}

  list(page = 1, perPage = 10, q = ''): Observable<CompanyListResponse> {
    return this.http.get<CompanyListResponse>(`${this.base}/company/list`, {
      params: { page, per_page: perPage, q },
    });
  }

  getById(id: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.base}/company/get/${id}`);
  }

  save(data: Company): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/company/save`, data);
  }

  update(id: number, data: Company): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/company/update/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.base}/company/delete/${id}`, {});
  }

  allCompanies(userId?: string | null): Observable<{ status: string; data: { company_id: number; company_name: string }[] }> {
    const params: Record<string, string> = {};
    if (userId) params['user_id'] = userId;
    return this.http.get<{ status: string; data: { company_id: number; company_name: string }[] }>(
      `${this.base}/companies/all`, { params }
    );
  }
}
