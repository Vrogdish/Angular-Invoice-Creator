import { Injectable, inject } from '@angular/core';
import { Product } from '../../products/models/product.model';
import { Customer } from '../../customers/models/customer.model';
import { BehaviorSubject } from 'rxjs';
import { CivilityEnum } from '../../../shared/models/civility.model';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { UserProfile } from '../../profile/models/userProfile.model';
import { Invoice, InvoiceForm } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  invoice$: BehaviorSubject<InvoiceForm> = new BehaviorSubject<InvoiceForm>({
    uid: '',
    num: 0,
    date: new Date(),
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

  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  invoices$ : BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  firestore = inject(Firestore);

  constructor() {}

  private setVendor(vendor: UserProfile): void {
    this.invoice$.next({
      ...this.invoice$.value,
      vendor: {
        civility: vendor.civility,
        company: vendor.company,
        firstname: vendor.firstname,
        lastname: vendor.lastname,
        email: vendor.email,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
        postalCode: vendor.postalCode,
        country: vendor.country,
      },
    });
  }

  private setDate(): void {
    this.invoice$.next({ ...this.invoice$.value, date: new Date() });
  }

  private async setInvoiceNum(uid: string) {
    await this.loadInvoices(uid);
    const num = this.invoices$.value ? this.invoices$.value.length + 1 : 1;
    this.invoice$.next({ ...this.invoice$.value, num });
  }

  private setUid(uid: string): void {
    this.invoice$.next({ ...this.invoice$.value, uid });
  }

  initInvoice(profile: UserProfile): void {
    this.setVendor(profile);
    this.setDate();
    this.setInvoiceNum(profile.uid);
    this.setUid(profile.uid);
  }

  setCustomer(customer: Customer): void {
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

  getTotalHT(): number {
    const total = this.invoice$.value.productsList.reduce(
      (acc, product) => acc + product.product.price * product.quantity,
      0
    );
    return total;
  }

  async loadInvoices(uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const invoices: Invoice[] = [];
      querySnapshot.forEach((doc) => {
        invoices.push({ ...doc.data(), id: doc.id } as Invoice);
      });
      this.invoices$.next(invoices);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next("Couldn't load invoices. Please try again.");
    }
  }

  async createInvoice(invoice: InvoiceForm) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      await addDoc(collectionRef, invoice);
      this.loadInvoices(invoice.uid);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next("Couldn't create invoice. Please try again.");
    } finally {
      this.isLoading$.next(false);
    }
  }

  deleteInvoice(id: string, uid: string) {
    console.log('delete invoice', id, uid);
  }
    
}
