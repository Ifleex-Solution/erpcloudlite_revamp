import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  status: string;
  token: string;
  user_type: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('user_type', res.user_type);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      tap(() => this.clearStorage()),
      catchError(() => { this.clearStorage(); return of(null); })
    );
  }

  me(): Observable<any> {
    return this.http.get(`${this.base}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_type');
  }
}
