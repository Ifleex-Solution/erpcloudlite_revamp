import { Routes } from '@angular/router';

export const roleRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./role-list/role-list.component').then(m => m.RoleListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./role-form/role-form.component').then(m => m.RoleFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./role-form/role-form.component').then(m => m.RoleFormComponent),
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
