import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';

export const roleRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 15, action: 'read'   }, loadComponent: () => import('./role-list/role-list.component').then(m => m.RoleListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 15, action: 'create' }, loadComponent: () => import('./role-form/role-form.component').then(m => m.RoleFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 15, action: 'update' }, loadComponent: () => import('./role-form/role-form.component').then(m => m.RoleFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
