import { Product } from '../../products/models/product.model';
import { Contact } from '../../../shared/models/contact.model';

export interface Invoice {
  id?: string;
  uid?: string;
  num: number;
  createdAt?: Date;
  deposit: number;
  discount: number;
  deliveries: {
    id: string;
    num: number;
  }[];
  vendor: Contact;
  customer: Contact;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  totalHt?: number;
}
