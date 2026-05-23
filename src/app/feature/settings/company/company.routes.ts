import { Routes } from '@angular/router';

export const companyRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./company-list/company-list.component').then(m => m.CompanyListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./company-form/company-form.component').then(m => m.CompanyFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./company-form/company-form.component').then(m => m.CompanyFormComponent),
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
