import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DeliveryForm } from '../../../../shared/forms/deliveryForm';
import { ProfileService } from '../../../profile/services/profile.service';
import { Customer } from '../../../customers/models/customer.model';
import { DeliveryAddress } from '../../models/delivery.model';
import { CartItem } from '../../../../shared/models/cartItem.model';
import { SelectCustomerComponent } from '../../../../shared/components/select-customer/select-customer.component';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { SelectProductComponent } from '../../../../shared/components/select-product/select-product.component';
import { DeliveryAddressFormComponent } from "../delivery-address-form/delivery-address-form.component";
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [
    SelectCustomerComponent,
    CommonModule,
    BtnComponent,
    RouterLink,
    SelectProductComponent,
    DeliveryAddressFormComponent
],
  templateUrl: './delivery-form.component.html',
  styleUrl: './delivery-form.component.scss',
})
export class DeliveryFormComponent implements OnInit {
  deliveryForm!: FormGroup;
  customerForm!: FormGroup;
  deliveryFormBuilder!: DeliveryForm;
  profile$ = this.profileService.profile$;
  step = 1;

  constructor(private profileService: ProfileService, private deliveryService : DeliveryService, private router : Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.profile$.subscribe((profile) => {
      if (!profile) return;
      this.deliveryFormBuilder = new DeliveryForm(profile)
      this.deliveryForm = this.deliveryFormBuilder.createFormGroup();
    });
    this.customerForm = this.deliveryForm.get('customer') as FormGroup;
  }

  patchCustomer(customer: Customer): void {
    this.deliveryForm.patchValue({ customer: customer, deliveryAddress : {
      address: customer.address,
      postalCode: customer.postalCode,
      city: customer.city,
      country: customer.country,
    } });
  }

  patchDeliveryAddress(deliveryAddress: DeliveryAddress): void {
    this.deliveryForm.patchValue(deliveryAddress);
  }

 

  addProduct(product: CartItem): void {
    const productsList = this.deliveryForm.get('productsList') as FormArray;
    const productGroup = new FormGroup({
      product: new FormGroup({
        id: new FormControl(product.product.id),
        reference: new FormControl(product.product.reference),
        name: new FormControl(product.product.name),
        description: new FormControl(product.product.description),
        price: new FormControl(product.product.price),
        tva: new FormControl(product.product.tva),
      }),
      quantity: new FormControl(product.quantity),
    });
    productsList.push(productGroup);
  }

  removeProduct(index: number): void {
    const productsList = this.deliveryForm.get('productsList') as FormArray;
    productsList.removeAt(index);
  }

  updateProductQuantity(event: { index: number; quantity: number }): void {
    const productsList = this.deliveryForm.get('productsList') as FormArray;
    const productGroup = productsList.at(event.index) as FormGroup;
    const quantity = productGroup.get('quantity')?.value + event.quantity;
    productGroup.patchValue({ quantity });
  }

  get hasProducts(): boolean {
    const productsList = this.deliveryForm.get('productsList') as FormArray;
    return productsList && productsList.length > 0;
  }

  createDelivery(): void {
    this.deliveryService.createDelivery(this.deliveryForm.value);
    this.router.navigate(['/delivery']);

  }

  nextStep(): void {
    this.step++;
  }

  previousStep(): void {
    this.step--;
  }
}
