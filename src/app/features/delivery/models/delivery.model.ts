import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CivilityEnum } from '../../../shared/models/civility.model';
import { Product, } from '../../products/models/product.model';
import { Customer } from '../../customers/models/customer.model';
import { ContactForm } from '../../../shared/models/contact.model';
import { UserProfile } from '../../profile/models/userProfile.model';

export interface DeliveryVendorForm {
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

export interface DeliveryCustomerForm {
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

// export interface DeliveryForm {
//   uid: string;
//   num: number;
//   createdAt: Date;
//   delivery: {
//     withDelivery: boolean;
//     deliveryAddress: DeliveryAddress;
//   };
//   vendor: DeliveryVendorForm;
//   customer: DeliveryCustomerForm;
//   productsList: {
//     product: Product;
//     quantity: number;
//   }[];
// }

// export interface Delivery extends DeliveryForm {
//   id: string;
// }

export interface Delivery {
  id: string;
  num: number;
  vendor: UserProfile;
  customer: Customer;
  deliveryAddress: DeliveryAddress;
  productsList: {
    product: Product;
    quantity: number;
  }[];
  createdAt: Date;
  uid: string;
}

export interface DeliveryForm {
  num: FormControl<number | null>;
  vendor: FormGroup<ContactForm>;
  customer: FormGroup<ContactForm>;
  deliveryAdress: FormGroup<DeliveryAddressForm>;
  productsList : FormArray<FormGroup<{
    product: FormControl<Product | null>,
    quantity: FormControl<number | null>
  }>>
  
}
