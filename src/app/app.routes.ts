import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from '@auth0/auth0-angular';
import { AboutComponent } from './about-page/about-page';
import { APP_ROUTES } from './configs/app-routes.config'; 

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
            path: APP_ROUTES.PRODUCTS,
            component: Products
          },
          {
            path: APP_ROUTES.PRODUCT_DETAIL,
            component: ProductDetail
          },
          {
            path: APP_ROUTES.ABOUT, 
            component: AboutComponent
          }
        ]
      },
      {
        path: APP_ROUTES.PROFILE,
        component: Profile
      },
    ]
  }
];
