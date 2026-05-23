import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';

export const userRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 14, action: 'read'   }, loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 14, action: 'create' }, loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 14, action: 'update' }, loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
