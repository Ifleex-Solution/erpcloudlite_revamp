import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const submoduleId: number | undefined = route.data?.['submoduleId'];
  const action: string                  = route.data?.['action'] ?? 'read';

  if (!submoduleId) return true;
  if (auth.canAccess(submoduleId, action as any)) return true;

  // Avoid infinite loop: if already on the fallback, go to login
  const fallback = state.url.startsWith('/branch') ? '/login' : '/branch/list';
  router.navigate([fallback]);
  return false;
};
