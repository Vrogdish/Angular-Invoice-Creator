import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CivilityEnum } from '../../../shared/models/civility.model';
import {
  DeliveryAdress,
  DocumentDetail,
} from '../models/document-detail.model';
import { UserProfile } from '../../profile/models/userProfile.model';
import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../products/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentMakerService {
  step$ = new BehaviorSubject<number>(1);
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  documentDetail$: BehaviorSubject<DocumentDetail> =
    new BehaviorSubject<DocumentDetail>({
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
        id: '',
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
      deliveryAddress: {
        address: '',
        postalCode: '',
        city: '',
        country: '',
      },
      productsList: [],
      deliveries: [],
    });

  setStep(step: number) {
    this.step$.next(step);
  }

  initDocumentDetail(profile: UserProfile) {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
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
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      customer: {
        id: customer.id,
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
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      customer: {
        id : '',
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

  updateDeliveryAddress(deliveryAddress: DeliveryAdress) {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      deliveryAddress: {
        address: deliveryAddress.address,
        postalCode: deliveryAddress.postalCode,
        city: deliveryAddress.city,
        country: deliveryAddress.country,
      },
    });
  }

  addProduct(product: Product, quantity: number): void {
    this.errorMessage$.next('');
    if (
      this.documentDetail$.value.productsList.some(
        (p) => p.product.id === product.id
      )
    ) {
      this.errorMessage$.next('Product déjà ajouté à la facture');
      return;
    }
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      productsList: [
        ...this.documentDetail$.value.productsList,
        { product : {
          id: product.id,
          name: product.name,
          reference: product.reference,
          description: product.description,
          price: product.price,
          tva: product.tva,
        }, quantity },
      ],
    });
  }

  removeProduct(id: string): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      productsList: this.documentDetail$.value.productsList.filter(
        (product) => product.product.id !== id
      ),
    });
  }

  incrementQuantity(id: string): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      productsList: this.documentDetail$.value.productsList.map((product) => {
        if (product.product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      }),
    });
  }

  decrementQuantity(id: string): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      productsList: this.documentDetail$.value.productsList.map((product) => {
        if (product.product.id === id && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    });
  }

  resetDocumentDetail(): void {
    this.documentDetail$.next({
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
        id : '',
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
      deliveryAddress: {
        address: '',
        postalCode: '',
        city: '',
        country: '',
      },
      productsList: [],
      deliveries: [],
    });
  }
}
