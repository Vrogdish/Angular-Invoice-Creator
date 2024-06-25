import { CivilityEnum } from '../../../shared/models/civility.model';
import { Product } from '../../products/models/product.model';

export interface InvoiceVendorForm {
  civility: CivilityEnum;
  firstname: string;
  lastname: string;
  email: string;
  company?: string;
  imageUrl?: string;
  phone?: string;
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
  company?: string;
  phone?: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface InvoiceForm {
  uid: string;
  num: number;
  date : Date;
  vendor : InvoiceVendorForm;
  customer: InvoiceCustomerForm;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  tva: number;
}

export interface Invoice extends InvoiceForm {
  id : string;
}
