import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../features/profile/models/userProfile.model';
import { generateNumber } from '../utils/generateNumber';

export class DeliveryForm {
  private profile: UserProfile;
  private createdAt: Date = new Date();

  constructor(profile: UserProfile) {
    this.profile = profile;
  }

  createAdressFormGroup(): FormGroup {
    return new FormGroup({
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl(''),
    });
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
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl(''),
    });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      num: new FormControl(generateNumber('delivery', this.profile)),
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
      deliveryAddress: this.createAdressFormGroup(),
      productsList: new FormArray([]),
      createdAt: new FormControl(this.createdAt),
      uid: new FormControl(this.profile.uid),
    });
  }
}
