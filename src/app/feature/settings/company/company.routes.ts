import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';

export const companyRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 13, action: 'read'   }, loadComponent: () => import('./company-list/company-list.component').then(m => m.CompanyListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 13, action: 'create' }, loadComponent: () => import('./company-form/company-form.component').then(m => m.CompanyFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 13, action: 'update' }, loadComponent: () => import('./company-form/company-form.component').then(m => m.CompanyFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
