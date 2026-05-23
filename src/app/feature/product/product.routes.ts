import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';

export const productRoutes: Routes = [
  // Brand (submodule 4)
  { path: 'brand/list',     canActivate: [permissionGuard], data: { submoduleId: 4, action: 'read'   }, loadComponent: () => import('./brand/brand-list/brand-list.component').then(m => m.BrandListComponent) },
  { path: 'brand/add',      canActivate: [permissionGuard], data: { submoduleId: 4, action: 'create' }, loadComponent: () => import('./brand/brand-form/brand-form.component').then(m => m.BrandFormComponent) },
  { path: 'brand/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 4, action: 'update' }, loadComponent: () => import('./brand/brand-form/brand-form.component').then(m => m.BrandFormComponent) },

  // OOP (submodule 5)
  { path: 'oop/list',     canActivate: [permissionGuard], data: { submoduleId: 5, action: 'read'   }, loadComponent: () => import('./oop/oop-list/oop-list.component').then(m => m.OopListComponent) },
  { path: 'oop/add',      canActivate: [permissionGuard], data: { submoduleId: 5, action: 'create' }, loadComponent: () => import('./oop/oop-form/oop-form.component').then(m => m.OopFormComponent) },
  { path: 'oop/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 5, action: 'update' }, loadComponent: () => import('./oop/oop-form/oop-form.component').then(m => m.OopFormComponent) },

  // Category (submodule 6)
  { path: 'category/list',     canActivate: [permissionGuard], data: { submoduleId: 6, action: 'read'   }, loadComponent: () => import('./category/category-list/category-list.component').then(m => m.CategoryListComponent) },
  { path: 'category/add',      canActivate: [permissionGuard], data: { submoduleId: 6, action: 'create' }, loadComponent: () => import('./category/category-form/category-form.component').then(m => m.CategoryFormComponent) },
  { path: 'category/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 6, action: 'update' }, loadComponent: () => import('./category/category-form/category-form.component').then(m => m.CategoryFormComponent) },

  // Subcategory (submodule 7)
  { path: 'subcategory/list',     canActivate: [permissionGuard], data: { submoduleId: 7, action: 'read'   }, loadComponent: () => import('./subcategory/subcategory-list/subcategory-list.component').then(m => m.SubcategoryListComponent) },
  { path: 'subcategory/add',      canActivate: [permissionGuard], data: { submoduleId: 7, action: 'create' }, loadComponent: () => import('./subcategory/subcategory-form/subcategory-form.component').then(m => m.SubcategoryFormComponent) },
  { path: 'subcategory/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 7, action: 'update' }, loadComponent: () => import('./subcategory/subcategory-form/subcategory-form.component').then(m => m.SubcategoryFormComponent) },

  // Unit (submodule 8)
  { path: 'unit/list',     canActivate: [permissionGuard], data: { submoduleId: 8, action: 'read'   }, loadComponent: () => import('./unit/unit-list/unit-list.component').then(m => m.UnitListComponent) },
  { path: 'unit/add',      canActivate: [permissionGuard], data: { submoduleId: 8, action: 'create' }, loadComponent: () => import('./unit/unit-form/unit-form.component').then(m => m.UnitFormComponent) },
  { path: 'unit/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 8, action: 'update' }, loadComponent: () => import('./unit/unit-form/unit-form.component').then(m => m.UnitFormComponent) },

  // Product (submodule 9)
  { path: 'product-info/list',     canActivate: [permissionGuard], data: { submoduleId: 9, action: 'read'   }, loadComponent: () => import('./product-info/product-info-list/product-info-list.component').then(m => m.ProductInfoListComponent) },
  { path: 'product-info/add',      canActivate: [permissionGuard], data: { submoduleId: 9, action: 'create' }, loadComponent: () => import('./product-info/product-info-form/product-info-form.component').then(m => m.ProductInfoFormComponent) },
  { path: 'product-info/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 9, action: 'update' }, loadComponent: () => import('./product-info/product-info-form/product-info-form.component').then(m => m.ProductInfoFormComponent) },

  // Product Group (submodule 10)
  { path: 'productgroup/list',     canActivate: [permissionGuard], data: { submoduleId: 10, action: 'read'   }, loadComponent: () => import('./product-group/product-group-list/product-group-list.component').then(m => m.ProductGroupListComponent) },
  { path: 'productgroup/add',      canActivate: [permissionGuard], data: { submoduleId: 10, action: 'create' }, loadComponent: () => import('./product-group/product-group-form/product-group-form.component').then(m => m.ProductGroupFormComponent) },
  { path: 'productgroup/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 10, action: 'update' }, loadComponent: () => import('./product-group/product-group-form/product-group-form.component').then(m => m.ProductGroupFormComponent) },

  // Conversion Ratio (submodule 11)
  { path: 'conversionratio/list',     canActivate: [permissionGuard], data: { submoduleId: 11, action: 'read'   }, loadComponent: () => import('./conversion-ratio/conversion-ratio-list/conversion-ratio-list.component').then(m => m.ConversionRatioListComponent) },
  { path: 'conversionratio/add',      canActivate: [permissionGuard], data: { submoduleId: 11, action: 'create' }, loadComponent: () => import('./conversion-ratio/conversion-ratio-form/conversion-ratio-form.component').then(m => m.ConversionRatioFormComponent) },
  { path: 'conversionratio/edit/:id', canActivate: [permissionGuard], data: { submoduleId: 11, action: 'update' }, loadComponent: () => import('./conversion-ratio/conversion-ratio-form/conversion-ratio-form.component').then(m => m.ConversionRatioFormComponent) },

  // Label Print (submodule 9 — product module)
  { path: 'labelprint', canActivate: [permissionGuard], data: { submoduleId: 9, action: 'read' }, loadComponent: () => import('./label-print/label-print.component').then(m => m.LabelPrintComponent) },

  { path: '', redirectTo: 'product-info/list', pathMatch: 'full' }
];
