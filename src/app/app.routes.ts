import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/profile/profile';
import { CreateComponent } from './pages/product-management/create-component/create-component';
import { PATH } from './core/constants/path';

export const routes: Routes = [
  {
    path: '',
    redirectTo: PATH.redirectTo,
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: PATH.products,
        component: Products,
      },
      {
        path: PATH.productDetailsRoute,
        component: ProductDetail,
      },
      {
        path: PATH.productCreatingRoute,
        component: CreateComponent,
      },
    ],
  },
  {
    path: PATH.profile,
    component: Profile,
  },
];
