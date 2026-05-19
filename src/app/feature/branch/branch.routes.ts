import { Routes } from '@angular/router';

export const branchRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./branch-list/branch-list.component').then(m => m.BranchListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./branch-form/branch-form.component').then(m => m.BranchFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./branch-form/branch-form.component').then(m => m.BranchFormComponent)
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];
