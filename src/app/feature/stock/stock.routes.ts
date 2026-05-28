import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const stockRoutes: Routes = [
  // Stock Adjustment (submodule 17)
  {
    path: 'adjustment/list',
    canActivate: [permissionGuard],
    data: { submoduleId: 17, action: 'read' },
    loadComponent: () =>
      import('./stock-adjustment/stock-adjustment-list/stock-adjustment-list.component')
        .then(m => m.StockAdjustmentListComponent),
  },
  {
    path: 'adjustment/add',
    canActivate: [permissionGuard],
    data: { submoduleId: 17, action: 'create' },
    loadComponent: () =>
      import('./stock-adjustment/stock-adjustment-form/stock-adjustment-form.component')
        .then(m => m.StockAdjustmentFormComponent),
  },
  {
    path: 'adjustment/edit/:id',
    canActivate: [permissionGuard],
    data: { submoduleId: 17, action: 'update' },
    loadComponent: () =>
      import('./stock-adjustment/stock-adjustment-form/stock-adjustment-form.component')
        .then(m => m.StockAdjustmentFormComponent),
  },
  { path: '', redirectTo: 'adjustment/list', pathMatch: 'full' },
];
