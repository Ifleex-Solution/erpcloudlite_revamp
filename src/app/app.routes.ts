import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'store', pathMatch: 'full' },
      {
        path: 'branch',
        loadChildren: () =>
          import('./feature/branch/branch.routes').then(m => m.branchRoutes)
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./feature/store/store.routes').then(m => m.storeRoutes)
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./feature/product/product.routes').then(m => m.productRoutes)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./feature/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
