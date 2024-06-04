import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { Product } from '../../products/models/product.model';
import { Customer } from '../../customers/models/customer.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  invoice$: BehaviorSubject<Invoice> = new BehaviorSubject<Invoice>({
    customer: {
      id: '',
      uid: '',
      civility: '',
      company: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      address: '',
      locality: '',
      postalCode: '',
    },
    productsList: [],
  });

  setCustomer(customer: Customer): void {
    this.invoice$.next({ ...this.invoice$.value, customer });
  }

  resetCustomer(): void {
    this.invoice$.next({
      ...this.invoice$.value,
      customer: {
        id: '',
        uid: '',
        civility: '',
        company: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        locality: '',
        postalCode: '',
      },
    });
  }

  addProduct(product: Product, quantity: number): void {
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
}
