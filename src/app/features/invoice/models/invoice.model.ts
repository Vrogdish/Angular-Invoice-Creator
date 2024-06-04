import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../products/models/product.model';

export interface Invoice {
  customer?: Customer;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  
}
