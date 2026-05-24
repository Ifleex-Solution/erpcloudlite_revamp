import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanySession {
  company_id:      number;
  company_name:    string;
  mobile:          string;
  address:         string;
  email:           string;
  website:         string;
  vat_no:          string;
  cr_no:           string;
  footer_text:     string;
  instance_type:   string;
  password_enable: number;
  theme_color:     string;
  theme_dark:      number;
}

export interface UserSession {
  user_id:    string;
  username:   string;
  fullname:   string;
  first_name: string;
  last_name:  string;
  user_type:  number;
  screen:     number;
  user_level: string;
}

export type PermMap = Record<string, { create: any; read: any; update: any; delete: any }>;

export interface LoginResponse {
  status:      string;
  token:       string;
  user:        UserSession;
  company:     CompanySession;
  permissions: PermMap;
}

const SESSION_KEYS = [
  'auth_token', 'login_time',
  'user_id', 'username', 'fullname', 'first_name', 'last_name',
  'user_type', 'screen', 'user_level',
  'company', 'permissions',
  'app-theme', 'app-dark',
];

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { username, password }).pipe(
      tap(res => {
        const u = res.user;
        const c = res.company;
        sessionStorage.setItem('auth_token',  res.token);
        sessionStorage.setItem('login_time',  Date.now().toString());
        sessionStorage.setItem('user_id',     u.user_id);
        sessionStorage.setItem('username',    u.username);
        sessionStorage.setItem('fullname',    u.fullname);
        sessionStorage.setItem('first_name',  u.first_name);
        sessionStorage.setItem('last_name',   u.last_name);
        sessionStorage.setItem('user_type',   u.user_type.toString());
        sessionStorage.setItem('screen',      u.screen.toString());
        sessionStorage.setItem('user_level',  u.user_level);
        sessionStorage.setItem('company',     JSON.stringify(c));
        sessionStorage.setItem('permissions', JSON.stringify(res.permissions ?? {}));
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

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const loginTime = parseInt(sessionStorage.getItem('login_time') ?? '0', 10);
    if (Date.now() - loginTime > TWO_HOURS_MS) {
      this.clearStorage();
      return false;
    }
    return true;
  }

  getToken():    string | null { return sessionStorage.getItem('auth_token'); }
  getUserId():   string        { return sessionStorage.getItem('user_id')   ?? ''; }
  getUsername(): string        { return sessionStorage.getItem('username')  ?? ''; }
  getFullname(): string        { return sessionStorage.getItem('fullname')  ?? ''; }
  getUserType(): number        { return parseInt(sessionStorage.getItem('user_type') ?? '0', 10); }
  getScreen():   number        { return parseInt(sessionStorage.getItem('screen')    ?? '1', 10); }
  getUserLevel():string        { return sessionStorage.getItem('user_level') ?? ''; }

  getCompany(): CompanySession {
    try { return JSON.parse(sessionStorage.getItem('company') ?? '{}'); }
    catch { return {} as CompanySession; }
  }

  getPermissions(): PermMap {
    try { return JSON.parse(sessionStorage.getItem('permissions') ?? '{}'); }
    catch { return {}; }
  }

  isAdmin(): boolean { return this.getUserType() === 1; }

  canAccess(submoduleId: number | string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
    if (this.isAdmin()) return true;
    const perm = this.getPermissions()[submoduleId.toString()];
    if (!perm) return false;
    const val = perm[action];
    return val === true || val === 1 || val === '1' || val === 'true';
  }

  clearStorage(): void {
    SESSION_KEYS.forEach(k => sessionStorage.removeItem(k));
  }
}
