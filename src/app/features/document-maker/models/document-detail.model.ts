import { Contact } from "../../../shared/models/contact.model";
import { DeliveryAddress } from "../../delivery/models/delivery.model";


export interface DocumentDetail {
  vendor: Contact;
  customer: Contact;
  deliveryAddress: DeliveryAddress
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
  deposit: number;
  discount: number;
}



