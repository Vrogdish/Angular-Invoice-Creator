import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { DeliveryAddressForm } from '../../models/invoice.model';
import { InvoiceCreatorService } from '../../services/invoice-creator.service';

@Component({
  selector: 'app-delivery-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BtnComponent],
  templateUrl: './delivery-address-form.component.html',
  styleUrl: './delivery-address-form.component.scss',
})
export class DeliveryAddressFormComponent implements OnInit {
  deliveryAddressForm: FormGroup<DeliveryAddressForm> =
    new FormGroup<DeliveryAddressForm>({
      address: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('France', Validators.required),
    });
  errorMessages = '';

  constructor(private invoiceCreatorService: InvoiceCreatorService) {}

  ngOnInit(): void {
    this.invoiceCreatorService.invoice$.subscribe((invoice) => {
      this.deliveryAddressForm.patchValue(invoice.delivery.deliveryAddress);
    });
    this.deliveryAddressForm.valueChanges.subscribe((currentValue) => {
      const previousValue = this.invoiceCreatorService.invoice$.value.delivery

      if (
        previousValue.deliveryAddress.address === currentValue.address &&
        previousValue.deliveryAddress.postalCode === currentValue.postalCode &&
        previousValue.deliveryAddress.city === currentValue.city &&
        previousValue.deliveryAddress.country === currentValue.country
      ) {
        return;
      }
      this.onChangeDeliveryAddress()
    })
  }

  onChangeDeliveryAddress(): void {
    if (this.deliveryAddressForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs';
    } else {
      this.errorMessages = '';

      this.invoiceCreatorService.updateDeliveryAddress({
        address: this.deliveryAddressForm.value.address || '',
        postalCode: this.deliveryAddressForm.value.postalCode || '',
        city: this.deliveryAddressForm.value.city || '',
        country: this.deliveryAddressForm.value.country || '',
      });
    }
    console.log(this.invoiceCreatorService.invoice$.value);
  }
}
