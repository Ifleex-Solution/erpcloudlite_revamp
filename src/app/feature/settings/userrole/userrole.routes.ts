import { Routes } from '@angular/router';

export const userroleRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./userrole-list/userrole-list.component').then(m => m.UserroleListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./userrole-form/userrole-form.component').then(m => m.UserroleFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./userrole-form/userrole-form.component').then(m => m.UserroleFormComponent),
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
