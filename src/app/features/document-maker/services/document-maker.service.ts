import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CivilityEnum } from '../../../shared/models/civility.model';
import { DocumentDetail } from '../models/document-detail.model';
import { UserProfile } from '../../profile/models/userProfile.model';
import { Customer } from '../../customers/models/customer.model';
import { Product } from '../../products/models/product.model';
import {
  Delivery,
  DeliveryAddress,
} from '../../delivery/models/delivery.model';

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
      deposit: 0,
      discount: 0,
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
    });
  }

  updateDeliveryAddress(deliveryAddress: DeliveryAddress) {
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
        {
          product: {
            id: product.id,
            name: product.name,
            reference: product.reference,
            description: product.description,
            price: product.price,
            tva: product.tva,
          },
          quantity,
        },
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

  resetProducts(): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      productsList: [],
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

  addDelivery(delivery: Delivery): void {
    if (!delivery.id) {
      return;
    }
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      deliveries: [
        ...this.documentDetail$.value.deliveries,
        { id: delivery.id, num: delivery.num },
      ],
    });
    const currentProducts = this.documentDetail$.value.productsList;
    for (const product of delivery.productsList) {
      if (!currentProducts.some((p) => p.product.id === product.product.id)) {
        this.addProduct(product.product, product.quantity);
      } else {
        const productToUpdate = currentProducts.find(
          (p) => p.product.id === product.product.id
        );
        if (productToUpdate) {
          this.documentDetail$.next({
            ...this.documentDetail$.value,
            productsList: currentProducts.map((p) => {
              if (p.product.id === product.product.id) {
                return { ...p, quantity: p.quantity + product.quantity };
              }
              return p;
            }),
          });
        }
      }
    }
  }
  removeDelivery(delivery: Delivery): void {
    const updatedDeliveries = this.documentDetail$.value.deliveries.filter(
      (item) => item.id !== delivery.id
    );
    const updatedProductsList = this.documentDetail$.value.productsList
      .map((p) => {
        const productInDelivery = delivery.productsList.find(
          (product) => product.product.id === p.product.id
        );
        if (productInDelivery) {
          const updatedQuantity = p.quantity - productInDelivery.quantity;
          return updatedQuantity > 0
            ? { ...p, quantity: updatedQuantity }
            : null;
        }
        return p;
      })
      .filter((p) => p !== null);
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      deliveries: updatedDeliveries,
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      productsList: updatedProductsList as any,
    });
  }

  setDeposit(deposit: number): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      deposit,
    });
  }

  setDiscount(discount: number): void {
    this.documentDetail$.next({
      ...this.documentDetail$.value,
      discount,
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
      deposit: 0,
      discount: 0,
    });
  }
}
