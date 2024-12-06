import { Contact } from '../../../shared/models/contact.model';
import { CartItem } from '../../../shared/models/cartItem.model';

export interface Invoice {
  id?: string;
  uid: string;
  num: number;
  createdAt: Date;
  deposit: number;
  discount: number;
  deliveries: {
    id: string;
    num: string;
  }[];
  vendor: Contact;
  customer: Contact;
  productsList: CartItem[];
  totalHt: number;
}
