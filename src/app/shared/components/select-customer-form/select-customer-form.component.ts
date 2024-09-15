import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Customer } from '../../../features/customers/models/customer.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeliveryAddressFormComponent } from "../../../features/invoice/components/delivery-address-form/delivery-address-form.component";

@Component({
  selector: 'app-select-customer-form',
  standalone: true,
  imports: [NgSelectModule, DeliveryAddressFormComponent],
  templateUrl: './select-customer-form.component.html',
  styleUrl: './select-customer-form.component.scss'
})
export class SelectCustomerFormComponent {
  @Output() customerSelected = new EventEmitter<Customer>();
  @Input() customers!: Customer[] | null;
  @Input() defaultValue : Customer | null = null;
  selectedCustomer: Customer | null = null;


  setCustomer(event: Customer): void {
    this.customerSelected.emit(event);
  }

  selectCustomer($event: Customer): void {
    this.selectedCustomer = $event;
  }

  resetCustomer(): void {
    this.selectedCustomer = null;
  }
}
