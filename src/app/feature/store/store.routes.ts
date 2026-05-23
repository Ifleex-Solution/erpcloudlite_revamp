import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const storeRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 3, action: 'read'   }, loadComponent: () => import('./store-list/store-list.component').then(m => m.StoreListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 3, action: 'create' }, loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 3, action: 'update' }, loadComponent: () => import('./store-form/store-form.component').then(m => m.StoreFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
