import { FormControl } from '@angular/forms';
import { Product } from '../../products/models/product.model';
import { Contact } from '../../../shared/models/contact.model';


export interface DeliveryAddress {
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface DeliveryAddressForm {
  address: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<string | null>;
}


export interface Delivery {
  id?: string;
  num: number;
  vendor: Contact;
  customer: Contact;
  deliveryAddress: DeliveryAddress;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  createdAt?: Date;
  uid: string;
}


