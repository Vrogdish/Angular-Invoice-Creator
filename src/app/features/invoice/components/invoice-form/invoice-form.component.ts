import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProfileService } from '../../../profile/services/profile.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InvoiceForm } from '../../../../shared/forms/invoiceForm';
import { Customer } from '../../../customers/models/customer.model';
import { CartItem } from '../../../../shared/models/cartItem.model';
import { CommonModule } from '@angular/common';
import { SelectCustomerComponent } from '../../../../shared/components/select-customer/select-customer.component';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { SelectProductComponent } from '../../../../shared/components/select-product/select-product.component';
import { SelectDeliveriesComponent } from '../../../../shared/components/select-deliveries/select-deliveries.component';
import { startWith } from 'rxjs';
import { Delivery } from '../../../delivery/models/delivery.model';
import { DeliveryService } from '../../../delivery/services/delivery.service';
import { InvoiceService } from '../../services/invoice.service';

enum InvoiceModeEnum {
  none = 'none',
  Manual = 'manual',
  WithDelivery = 'withDelivery',
}

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    SelectCustomerComponent,
    BtnComponent,
    RouterLink,
    SelectProductComponent,
    SelectDeliveriesComponent,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  customerForm!: FormGroup;
  customerIdSelected!: string;
  cart!: CartItem[];
  filteredDeliveries!: Delivery[];
  selectedDeliveries: WritableSignal<Delivery[]> = signal([]);
  invoiceFormBuilder!: InvoiceForm;
  profile$ = this.profileService.profile$;
  step = 1;
  invoiceMode = signal(InvoiceModeEnum.none);
  totalAmount = 0;

  constructor(
    private profileService: ProfileService,
    private deliveryService: DeliveryService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    (this.invoiceForm.get('productsList') as FormArray).valueChanges
      .pipe(
        startWith((this.invoiceForm.get('productsList') as FormArray)?.value)
      )
      .subscribe((productsList) => {
        this.cart = productsList;
      });
    this.deliveryService.deliveries$.subscribe((deliveries) => {
      this.filteredDeliveries = deliveries;
    });
  }

  initializeForm(): void {
    this.profile$.subscribe((profile) => {
      if (!profile) return;
      this.invoiceFormBuilder = new InvoiceForm(profile);
      this.invoiceForm = this.invoiceFormBuilder.createFormGroup();
    });
    this.customerForm = this.invoiceForm.get('customer') as FormGroup;
  }

  patchCustomer(customer: Customer): void {
    this.invoiceForm.patchValue({ customer: customer });
    this.filteredDeliveries = this.filteredDeliveries.filter(
      (delivery) => delivery.customer.id === customer.id
    );
 
  }

  patchProductsList(cart: CartItem[]): void {
    this.invoiceForm.patchValue({ productsList: cart });
  }

  setInvoiceModeManual(): void {
    this.invoiceMode.set(InvoiceModeEnum.Manual);
  }
  setInvoiceModeWithDelivery(): void {
    this.invoiceMode.set(InvoiceModeEnum.WithDelivery);
  }

  addProduct(product: CartItem): void {
    const productsList = this.invoiceForm.get('productsList') as FormArray;
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
    this.calculateTotalAmount();

  }

  removeProduct(index: number): void {
    const productsList = this.invoiceForm.get('productsList') as FormArray;
    productsList.removeAt(index);
    this.calculateTotalAmount();

  }

  updateProductQuantity(event: { index: number; quantity: number }): void {
    const productsList = this.invoiceForm.get('productsList') as FormArray;
    const productGroup = productsList.at(event.index) as FormGroup;
    const quantity = productGroup.get('quantity')?.value + event.quantity;
    productGroup.patchValue({ quantity });
    this.calculateTotalAmount();

  }

  get hasProducts(): boolean {
    const productsList = this.invoiceForm.get('productsList') as FormArray;
    return productsList && productsList.length > 0;
  }

  addDelivery(delivery: Delivery): void {
    const deliveriesIdArray = this.invoiceForm.get('deliveries') as FormArray;
    deliveriesIdArray.push(
      new FormControl({ id: delivery.id, num: delivery.num })
    );
    this.filteredDeliveries = this.filteredDeliveries.filter(
      (filteredDelivery) => filteredDelivery.id !== delivery.id
    );
    this.selectedDeliveries.set([...this.selectedDeliveries(), delivery]);
    this.addProductFromDelivery(delivery);
  }

  removeDelivery(delivery: Delivery): void {
    const deliveriesIdArray = this.invoiceForm.get('deliveries') as FormArray;
    const indexToRemove = deliveriesIdArray.controls.findIndex(
      (control) => control.value.id  === delivery.id
    );

    if (indexToRemove > -1) {
      deliveriesIdArray.removeAt(indexToRemove);
    }
    this.selectedDeliveries.set(
      this.selectedDeliveries().filter(
        (selectedDelivery) => selectedDelivery.id !== delivery.id
      )
    );
    this.filteredDeliveries.push(delivery);
    this.removeProductFromDelivery(delivery);
    this.calculateTotalAmount();
  }

  private addProductFromDelivery(delivery: Delivery): void {
    const productsFromDelivery = delivery.productsList;
    const productsFormArray = this.invoiceForm.get('productsList') as FormArray;
    productsFromDelivery.forEach((deliveryProduct) => {
      const existingProductIndex = productsFormArray.controls.findIndex(
        (control) => control.value.product.id === deliveryProduct.product.id
      );
      if (existingProductIndex > -1) {
        const existingProductControl =
          productsFormArray.at(existingProductIndex);
        const updatedQuantity =
          existingProductControl.value.quantity + deliveryProduct.quantity;
        existingProductControl.patchValue({ quantity: updatedQuantity });
      } else {
        const newProductControl =
          this.invoiceFormBuilder.createProductFormGroup(deliveryProduct);
        productsFormArray.push(newProductControl);
      }
    });
    this.calculateTotalAmount();
  }

  private removeProductFromDelivery(delivery: Delivery): void {
    const productsFromDelivery = delivery.productsList;
    const productsFormArray = this.invoiceForm.get('productsList') as FormArray;
    productsFromDelivery.forEach((deliveryProduct) => {
      const existingProductIndex = productsFormArray.controls.findIndex(
        (control) => control.value.product.id === deliveryProduct.product.id
      );
      if (existingProductIndex > -1) {
        const existingProductControl =
          productsFormArray.at(existingProductIndex);
        const updatedQuantity =
          existingProductControl.value.quantity - deliveryProduct.quantity;
        if (updatedQuantity > 0) {
          existingProductControl.patchValue({ quantity: updatedQuantity });
        } else {
          productsFormArray.removeAt(existingProductIndex);
        }
      }
    });
  }

  calculateTotalAmount() {
    const productsList = this.invoiceForm.get('productsList') as FormArray;
    this.totalAmount = productsList.controls.reduce((acc, control) => {
      const product = control.value.product;
      const quantity = control.value.quantity;
      return acc + product.price * quantity;
    }, 0);
    this.invoiceForm.patchValue({ totalHt: this.totalAmount });
  }

  createInvoice(): void {
    this.invoiceService.createInvoice(this.invoiceForm.value);
    this.router.navigate(['/invoice']);
  }

  nextStep(): void {
    this.step++;
  }

  previousStep(): void {
    this.step--;
  }
}
