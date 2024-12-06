import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-address-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delivery-address-form.component.html',
  styleUrl: './delivery-address-form.component.scss',
})
export class DeliveryAddressFormComponent implements OnInit {
  @Input() deliveryForm!: FormGroup;
  errorMessages = '';
  deliveryAddressForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    if (this.deliveryForm) {
      this.deliveryAddressForm = this.deliveryForm.get('deliveryAddress') as FormGroup;
      if (!this.deliveryAddressForm) {
        console.error('deliveryAddress group is not present in the parent form.');
      }
    } else {
      console.error('deliveryForm is not provided.');
    }
  }
}
