import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { BtnComponent } from '../btn/btn.component';
import { Delivery } from '../../../features/delivery/models/delivery.model';
import { CartItem } from '../../models/cartItem.model';

@Component({
  selector: 'app-select-deliveries',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    BtnComponent,
    MatTableModule,
    FormsModule,
  ],
  templateUrl: './select-deliveries.component.html',
  styleUrl: './select-deliveries.component.scss',
})
export class SelectDeliveriesComponent {
  @Output() addDeliveryEmitter: EventEmitter<Delivery> =
    new EventEmitter<Delivery>();
  @Output() removeDeliveryEmitter: EventEmitter<Delivery> =
    new EventEmitter<Delivery>();
  @Input() cart!: CartItem[];
  @Input() deliveries!: Delivery[];
  @Input() selectedDeliveries: Delivery[] = [];
  @Input() totalAmount!: number;

  deliveryToAdd!: Delivery | null;
  displayedColumns: string[] = [
    'num',
    'customer',
    'products',
    'createdAt',
    'delete',
  ];
  productDisplayedColumns: string[] = [
    'ref',
    'name',
    'price',
    'quantity',
    'total',
  ];


  selectDelivery($event: Delivery) {
    this.deliveryToAdd = $event;
  }

  addDelivery() {
    if (!this.deliveryToAdd) {
      return;
    }
    this.addDeliveryEmitter.emit(this.deliveryToAdd);
    this.deliveryToAdd = null;
  }

  removeDelivery(delivery: Delivery) {
    this.removeDeliveryEmitter.emit(delivery);
  }
  
  
}
