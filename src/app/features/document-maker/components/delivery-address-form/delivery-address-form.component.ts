import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { DocumentMakerService } from '../../services/document-maker.service';
import { Subscription } from 'rxjs';
import { DeliveryAddressForm } from '../../../delivery/models/delivery.model';

@Component({
  selector: 'app-delivery-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BtnComponent],
  templateUrl: './delivery-address-form.component.html',
  styleUrl: './delivery-address-form.component.scss',
})
export class DeliveryAddressFormComponent implements OnInit, OnDestroy {
  deliveryAddressForm: FormGroup<DeliveryAddressForm> =
    new FormGroup<DeliveryAddressForm>({
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('France', Validators.required),
    });
  errorMessages = '';
  subscription: Subscription = new Subscription();

  constructor(private documentMakerservice: DocumentMakerService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.documentMakerservice.documentDetail$.subscribe((document) => {
        this.deliveryAddressForm.patchValue(document.deliveryAddress);
      })
    );

    this.subscription.add(
      this.deliveryAddressForm.valueChanges.subscribe((currentValue) => {
        const previousValue =
          this.documentMakerservice.documentDetail$.value.deliveryAddress;

        if (
          previousValue?.address === currentValue.address &&
          previousValue?.postalCode === currentValue.postalCode &&
          previousValue?.city === currentValue.city &&
          previousValue?.country === currentValue.country
        ) {
          return;
        }
        this.onChangeDeliveryAddress();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChangeDeliveryAddress(): void {
    if (this.deliveryAddressForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs';
    } else {
      this.errorMessages = '';

      this.documentMakerservice.updateDeliveryAddress({
        address: this.deliveryAddressForm.value.address || '',
        postalCode: this.deliveryAddressForm.value.postalCode || '',
        city: this.deliveryAddressForm.value.city || '',
        country: this.deliveryAddressForm.value.country || '',
      });
    }
  }
}
