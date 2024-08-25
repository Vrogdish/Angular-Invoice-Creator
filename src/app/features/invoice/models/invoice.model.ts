import { FormControl } from '@angular/forms';
import { CivilityEnum } from '../../../shared/models/civility.model';
import { Product } from '../../products/models/product.model';

export interface InvoiceVendorForm {
  civility: CivilityEnum;
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface InvoiceCustomerForm {
  civility: CivilityEnum;
  firstname: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

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

export interface InvoiceForm {
  uid: string;
  num: number;
  createdAt: Date;
  delivery: {
    withDelivery: boolean;
    deliveryAddress: DeliveryAddress;
  };
  vendor: InvoiceVendorForm;
  customer: InvoiceCustomerForm;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  tva: number;
}

export interface Invoice extends InvoiceForm {
  id: string;
}
