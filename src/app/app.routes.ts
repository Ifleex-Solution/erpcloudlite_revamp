import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
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
        children: [
          {
            path: 'company',
            loadChildren: () =>
              import('./feature/settings/company/company.routes').then(m => m.companyRoutes)
          },
          {
            path: 'user',
            loadChildren: () =>
              import('./feature/settings/user/user.routes').then(m => m.userRoutes)
          },
          {
            path: 'role',
            loadChildren: () =>
              import('./feature/settings/role/role.routes').then(m => m.roleRoutes)
          },
          {
            path: 'userrole',
            loadChildren: () =>
              import('./feature/settings/userrole/userrole.routes').then(m => m.userroleRoutes)
          },
          { path: '', redirectTo: 'company', pathMatch: 'full' }
        ]
      }
    ]
  }
];
