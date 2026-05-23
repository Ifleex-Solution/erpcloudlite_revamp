import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';

export const userroleRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 16, action: 'read'   }, loadComponent: () => import('./userrole-list/userrole-list.component').then(m => m.UserroleListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 16, action: 'create' }, loadComponent: () => import('./userrole-form/userrole-form.component').then(m => m.UserroleFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 16, action: 'update' }, loadComponent: () => import('./userrole-form/userrole-form.component').then(m => m.UserroleFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
