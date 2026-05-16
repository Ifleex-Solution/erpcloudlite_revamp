import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'store', pathMatch: 'full' },
      {
        path: 'store',
        loadChildren: () =>
          import('./feature/store/store.routes').then(m => m.storeRoutes)
      }
    ]
  }
];
