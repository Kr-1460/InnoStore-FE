import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/profile/profile';
import { CreateComponent } from './pages/product-management/create-component/create-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'products',
        component: Products,
      },
      {
        path: 'product/:id',
        component: ProductDetail,
      },
      {
        path: 'products/create',
        component: CreateComponent,
      },
    ],
  },
  {
    path: 'profile',
    component: Profile,
  },
];
