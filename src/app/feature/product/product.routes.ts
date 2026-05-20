import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  // Brand
  { path: 'brand/list', loadComponent: () => import('./brand/brand-list/brand-list.component').then(m => m.BrandListComponent) },
  { path: 'brand/add',  loadComponent: () => import('./brand/brand-form/brand-form.component').then(m => m.BrandFormComponent) },
  { path: 'brand/edit/:id', loadComponent: () => import('./brand/brand-form/brand-form.component').then(m => m.BrandFormComponent) },

  // OOP
  { path: 'oop/list', loadComponent: () => import('./oop/oop-list/oop-list.component').then(m => m.OopListComponent) },
  { path: 'oop/add',  loadComponent: () => import('./oop/oop-form/oop-form.component').then(m => m.OopFormComponent) },
  { path: 'oop/edit/:id', loadComponent: () => import('./oop/oop-form/oop-form.component').then(m => m.OopFormComponent) },

  // Category
  { path: 'category/list', loadComponent: () => import('./category/category-list/category-list.component').then(m => m.CategoryListComponent) },
  { path: 'category/add',  loadComponent: () => import('./category/category-form/category-form.component').then(m => m.CategoryFormComponent) },
  { path: 'category/edit/:id', loadComponent: () => import('./category/category-form/category-form.component').then(m => m.CategoryFormComponent) },

  // Subcategory
  { path: 'subcategory/list', loadComponent: () => import('./subcategory/subcategory-list/subcategory-list.component').then(m => m.SubcategoryListComponent) },
  { path: 'subcategory/add',  loadComponent: () => import('./subcategory/subcategory-form/subcategory-form.component').then(m => m.SubcategoryFormComponent) },
  { path: 'subcategory/edit/:id', loadComponent: () => import('./subcategory/subcategory-form/subcategory-form.component').then(m => m.SubcategoryFormComponent) },

  // Unit
  { path: 'unit/list', loadComponent: () => import('./unit/unit-list/unit-list.component').then(m => m.UnitListComponent) },
  { path: 'unit/add',  loadComponent: () => import('./unit/unit-form/unit-form.component').then(m => m.UnitFormComponent) },
  { path: 'unit/edit/:id', loadComponent: () => import('./unit/unit-form/unit-form.component').then(m => m.UnitFormComponent) },

  // Product
  { path: 'product-info/list', loadComponent: () => import('./product-info/product-info-list/product-info-list.component').then(m => m.ProductInfoListComponent) },
  { path: 'product-info/add',  loadComponent: () => import('./product-info/product-info-form/product-info-form.component').then(m => m.ProductInfoFormComponent) },
  { path: 'product-info/edit/:id', loadComponent: () => import('./product-info/product-info-form/product-info-form.component').then(m => m.ProductInfoFormComponent) },

  // Product Group
  { path: 'productgroup/list', loadComponent: () => import('./product-group/product-group-list/product-group-list.component').then(m => m.ProductGroupListComponent) },
  { path: 'productgroup/add',  loadComponent: () => import('./product-group/product-group-form/product-group-form.component').then(m => m.ProductGroupFormComponent) },
  { path: 'productgroup/edit/:id', loadComponent: () => import('./product-group/product-group-form/product-group-form.component').then(m => m.ProductGroupFormComponent) },

  // Conversion Ratio
  { path: 'conversionratio/list', loadComponent: () => import('./conversion-ratio/conversion-ratio-list/conversion-ratio-list.component').then(m => m.ConversionRatioListComponent) },
  { path: 'conversionratio/add',  loadComponent: () => import('./conversion-ratio/conversion-ratio-form/conversion-ratio-form.component').then(m => m.ConversionRatioFormComponent) },
  { path: 'conversionratio/edit/:id', loadComponent: () => import('./conversion-ratio/conversion-ratio-form/conversion-ratio-form.component').then(m => m.ConversionRatioFormComponent) },

  // Label Print
  { path: 'labelprint', loadComponent: () => import('./label-print/label-print.component').then(m => m.LabelPrintComponent) },

  { path: '', redirectTo: 'product-info/list', pathMatch: 'full' }
];
