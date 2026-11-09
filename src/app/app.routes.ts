import { Routes } from '@angular/router';

import { ProductListComponent } from './features/product/product-list/product-list.component';
import { ProductFormComponent } from './features/product/product-form/product-form.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  {
    path: 'products',
    component: ProductListComponent
  },

  {
    path: 'products/add',
    component: ProductFormComponent
  },

  {
    path: 'products/edit/:id',
    component: ProductFormComponent
  },

  {
    path: '**',
    redirectTo: 'products'
  }

];