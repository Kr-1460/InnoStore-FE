export const APP_ROUTES = {
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product/:id',
  PROFILE: 'profile',
  ABOUT: 'about'
} as const;

export const ROUTE_LINKS = {
  PRODUCTS: `/${APP_ROUTES.PRODUCTS}`,
  PROFILE: `/${APP_ROUTES.PROFILE}`,
  ABOUT: `/${APP_ROUTES.ABOUT}`,
  PRODUCT_DETAIL: (id: string | number) => `/product/${id}`
};