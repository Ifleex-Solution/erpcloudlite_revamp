import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const branchRoutes: Routes = [
  { path: 'list',     canActivate: [permissionGuard], data: { submoduleId: 2, action: 'read'   }, loadComponent: () => import('./branch-list/branch-list.component').then(m => m.BranchListComponent) },
  { path: 'add',      canActivate: [permissionGuard], data: { submoduleId: 2, action: 'create' }, loadComponent: () => import('./branch-form/branch-form.component').then(m => m.BranchFormComponent) },
  { path: 'edit/:id', canActivate: [permissionGuard], data: { submoduleId: 2, action: 'update' }, loadComponent: () => import('./branch-form/branch-form.component').then(m => m.BranchFormComponent) },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
