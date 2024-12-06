import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../features/profile/models/userProfile.model';
import { generateNumber } from '../utils/generateNumber';
import { Product } from '../../features/products/models/product.model';

export class InvoiceForm {
  private profile: UserProfile;
  private createdAt: Date = new Date();

  constructor(profile: UserProfile) {
    this.profile = profile;
  }

  createCustomerFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl('', Validators.required),
      civility: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      company: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
    });
  }

  createProductFormGroup(deliveryProduct: {
    product: Product;
    quantity: number;
  }): FormGroup {
    return new FormGroup({
      product: new FormControl(deliveryProduct.product),
      quantity: new FormControl(deliveryProduct.quantity),
    });
  }

  createDeliveryForm(delivery: { id: string; num: string }): FormGroup {
    return new FormGroup({
      id: new FormControl(delivery.id),
      num: new FormControl(delivery.num),
    });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      num: new FormControl(generateNumber('invoice', this.profile)),
      vendor: new FormGroup({
        civility: new FormControl(this.profile.civility),
        firstname: new FormControl(this.profile.firstname),
        lastname: new FormControl(this.profile.lastname),
        company: new FormControl(this.profile.company),
        email: new FormControl(this.profile.email),
        phone: new FormControl(this.profile.phone),
        address: new FormControl(this.profile.address),
        postalCode: new FormControl(this.profile.postalCode),
        city: new FormControl(this.profile.city),
        country: new FormControl(this.profile.country),
      }),
      customer: this.createCustomerFormGroup(),
      productsList: new FormArray([]),
      deliveries: new FormArray([]),
      deposit: new FormControl(''),
      discount: new FormControl(''),
      totalHt: new FormControl(''),
      createdAt: new FormControl(this.createdAt),
      uid: new FormControl(this.profile.uid),
    });
  }
}
