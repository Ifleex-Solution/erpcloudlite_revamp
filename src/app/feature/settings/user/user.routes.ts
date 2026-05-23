import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./user-list/user-list.component').then(m => m.UserListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./user-form/user-form.component').then(m => m.UserFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./user-form/user-form.component').then(m => m.UserFormComponent),
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
