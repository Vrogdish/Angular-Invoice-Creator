import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeliveryAddress, InvoiceForm } from '../models/invoice.model';
import { CivilityEnum } from '../../../shared/models/civility.model';
import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../products/models/product.model';
import { UserProfile } from '../../profile/models/userProfile.model';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceCreatorService {
  step$ = new BehaviorSubject<number>(1);
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  invoice$: BehaviorSubject<InvoiceForm> = new BehaviorSubject<InvoiceForm>({
    uid: '',
    num: 0,
    createdAt: new Date(),
    delivery: {
      withDelivery: false,
      deliveryAddress: {
        address: '',
        postalCode: '',
        city: '',
        country: '',
      },
    },
    vendor: {
      civility: CivilityEnum.male,
      firstname: '',
      lastname: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    customer: {
      civility: CivilityEnum.male,
      company: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    productsList: [],
    tva: 0.2,
  });

  constructor(private invoiceService : InvoiceService) {}

  private setInvoiceNumber(profile : UserProfile): number {
    let number = 1
    this.invoiceService.loadInvoices(profile.uid);
    this.invoiceService.invoices$.subscribe((invoices) => {
      if (invoices.length === 0) {
        number = 1;
      }
      invoices.sort((a, b) => b.num - a.num);
      number = invoices[0].num + 1;
    });
     return number;
  }


  setStep(step: number) {
    this.step$.next(step);
  }

  initInvoice(profile: UserProfile) {
    this.invoice$.next({
      ...this.invoice$.value,
      uid: profile.uid,
      createdAt: new Date(),
      num: this.setInvoiceNumber(profile),
      vendor: {
        civility: profile.civility,
        company: profile.company,
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
      },
    });
  }

  setCustomer(customer: Customer) {
    this.invoice$.next({
      ...this.invoice$.value,
      customer: {
        civility: customer.civility,
        company: customer.company,
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
      },
    });
  }
  resetCustomer(): void {
    this.invoice$.next({
      ...this.invoice$.value,
      customer: {
        civility: CivilityEnum.male,
        company: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
    });
  }

  setDelivery(delivery: boolean) {
    this.invoice$.next({
      ...this.invoice$.value,
      delivery: {
        withDelivery: delivery,
        deliveryAddress: {
          address: '',
          postalCode: '',
          city: '',
          country: '',
        },
      },
    });
  }

  updateDeliveryAddress(deliveryAddress: DeliveryAddress) {
    this.invoice$.next({
      ...this.invoice$.value,
      delivery: {
        withDelivery: this.invoice$.value.delivery.withDelivery,
        deliveryAddress: deliveryAddress,
      },
    });
  }

  addProduct(product: Product, quantity: number): void {
    this.errorMessage$.next('');
    if (
      this.invoice$.value.productsList.some((p) => p.product.id === product.id)
    ) {
      this.errorMessage$.next('Product déjà ajouté à la facture');
      return;
    }
    this.invoice$.next({
      ...this.invoice$.value,
      productsList: [
        ...this.invoice$.value.productsList,
        { product, quantity },
      ],
    });
  }

  removeProduct(id: string): void {
    this.invoice$.next({
      ...this.invoice$.value,
      productsList: this.invoice$.value.productsList.filter(
        (product) => product.product.id !== id
      ),
    });
  }

  incrementQuantity(id: string): void {
    this.invoice$.next({
      ...this.invoice$.value,
      productsList: this.invoice$.value.productsList.map((product) => {
        if (product.product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      }),
    });
  }

  decrementQuantity(id: string): void {
    this.invoice$.next({
      ...this.invoice$.value,
      productsList: this.invoice$.value.productsList.map((product) => {
        if (product.product.id === id && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    });
  }

  resetInvoice(): void {
    this.invoice$.next({
      uid: '',
      num: 0,
      createdAt: new Date(),
      delivery: {
        withDelivery: false,
        deliveryAddress: {
          address: '',
          postalCode: '',
          city: '',
          country: '',
        },
      },
      vendor: {
        civility: CivilityEnum.male,
        firstname: '',
        lastname: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
      customer: {
        civility: CivilityEnum.male,
        company: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
      productsList: [],
      tva: 0.2,
    });
  }
}
