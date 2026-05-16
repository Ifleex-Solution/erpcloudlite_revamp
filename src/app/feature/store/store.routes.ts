import { Routes } from '@angular/router';

export const storeRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./store-list/store-list.component').then(m => m.StoreListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./store-form/store-form.component').then(m => m.StoreFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./store-form/store-form.component').then(m => m.StoreFormComponent)
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
