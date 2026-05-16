import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(LocalStorageService);
  const router = inject(Router);
  const token = storage.getItem('token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        storage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
