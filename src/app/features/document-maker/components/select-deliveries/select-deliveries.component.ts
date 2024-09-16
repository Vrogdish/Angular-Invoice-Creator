import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DeliveryService } from '../../../delivery/services/delivery.service';
import { BehaviorSubject } from 'rxjs';
import { Delivery } from '../../../delivery/models/delivery.model';
import { DocumentDetail } from '../../models/document-detail.model';
import { DocumentMakerService } from '../../services/document-maker.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

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
export class SelectDeliveriesComponent implements OnInit {
  deliveries$!: BehaviorSubject<Delivery[]>;
  documentDetail$!: BehaviorSubject<DocumentDetail>;
  deliveryToAdd!: Delivery | null;
  selectedDeliveries: WritableSignal<Delivery[]> = signal([]);
  displayedColumns: string[] = [
    'num',
    'customer',
    'products',
    'createdAt',
    'delete',
  ];
  productDisplayedColumns: string[] = ['ref', 'name', 'price', 'quantity', 'total'];

  filteredDeliveries: Delivery[] = [];
  totalAmount = 0;

  constructor(
    private deliveryService: DeliveryService,
    private documentMakerService: DocumentMakerService
  ) {}

  ngOnInit(): void {
    this.deliveries$ = this.deliveryService.deliveries$;
    this.documentDetail$ = this.documentMakerService.documentDetail$;
    this.deliveries$.subscribe((deliveries) => {
      this.filteredDeliveries = deliveries.filter(
        (delivery) =>
          delivery.customer.id === this.documentDetail$.value.customer.id
      );
    });
  }

  selectDelivery($event: Delivery): void {
    this.deliveryToAdd = $event;
    console.log(this.deliveryToAdd);
  }

  addDelivery(): void {
    if (this.deliveryToAdd) {
      const currentDeliveries = this.selectedDeliveries();
      if (
        !currentDeliveries.some(
          (delivery) => delivery.id === this.deliveryToAdd?.id
        )
      ) {
        this.selectedDeliveries.set([...currentDeliveries, this.deliveryToAdd]);
        this.documentMakerService.addDelivery(this.deliveryToAdd);
      }
      this.filteredDeliveries = this.filteredDeliveries.filter(
        (delivery) => delivery.id !== this.deliveryToAdd?.id
      );
    }
    this.deliveryToAdd = null;
    this.totalAmount = this.getTotalPrice();
  }

  removeDelivery(delivery : Delivery): void {
    const currentDeliveries = this.selectedDeliveries();
    const updatedDeliveries = currentDeliveries.filter(
      (item) => item.id !== delivery.id
    );
    this.selectedDeliveries.set(updatedDeliveries);
    this.documentMakerService.removeDelivery(delivery);
    this.totalAmount = this.getTotalPrice();
    this.filteredDeliveries = [...this.filteredDeliveries, delivery];
  }

  private getTotalPrice(): number {
    return this.documentDetail$.value.productsList.reduce(
      (acc, product) => acc + product.product.price * product.quantity,
      0
    );
  }
  
}
