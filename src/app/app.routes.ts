import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MainLayout,
        children: [
          {
            path: 'products',
            component: Products
          },
          {
            path: 'product/:id',
            component: ProductDetail
          }
        ]
      },
      {
        path: 'profile',
        component: Profile
      }
    ]
  }
];
