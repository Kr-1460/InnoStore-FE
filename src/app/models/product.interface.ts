import { ProductSize } from './product-size.interface';
import { ProductColor } from './product-color.interface';

export interface Product {
  id: number;
  name: string;
  fullName: string;
  price: number;
  image: string;
  images: string[];
  inStock: boolean;
  category: string;
  sizes: ProductSize[];
  colors: ProductColor[];
}
