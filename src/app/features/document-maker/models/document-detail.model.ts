import { FormControl } from "@angular/forms";

export interface DocumentDetail {
  vendor: {
    civility: string;
    firstname: string;
    lastname: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  customer: {
    id: string;
    civility: string;
    company: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  deliveryAddress: {
    address: string;
    postalCode: string;
    city: string;
    country: string;
  };
  productsList: {
    product: {
      id : string;
      name: string;
      description: string;
      reference : string;
      price: number;
      tva: number;
    };
    quantity: number;
  }[];
  deliveries: {
    id: string;
    num: number;
  }[];
}

export interface DeliveryAdress {
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface DeliveryAddressForm {
  address: FormControl< string | null>;
  postalCode: FormControl< string | null>;
  city: FormControl< string | null>;
  country: FormControl< string | null>;
}