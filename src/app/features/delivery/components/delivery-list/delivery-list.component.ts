import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Delivery } from '../../models/delivery.model';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';

import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../invoice/services/invoice.service';
import { Invoice } from '../../../invoice/models/invoice.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dialog-delivery',
  templateUrl: 'dialog.component.html',
  styleUrl: './delivery-list.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    BtnComponent,
  ],
})
export class DialogComponent {
  constructor(public dialogRef: MatDialogRef<DialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [
    MatTableModule,
    DialogComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss'
})
export class DeliveryListComponent implements OnChanges, OnInit, OnDestroy {
  @Input() deliveries: Delivery[] = [];
  @Input() searchQuery = '';
  filteredDelivery: Delivery[] = [];
  displayedColumns: string[] = [
    'number',
    'date',
    'customer',
    'products',
    'address',
    'invoice',
    'delete',
  ];
  invoices! : Invoice[];
  subscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private deliveryService: DeliveryService,
    private auth: AuthService,
    private invoiceService: InvoiceService
    ) {}

    ngOnInit(): void {
      this.subscription = (this.invoiceService.invoices$.subscribe((invoices) => {
        this.invoices = invoices;
      }))
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['deliveries'] || changes['searchQuery']) {
        this.filterDelivery();
      }
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  
    private filterDelivery() {
      this.filteredDelivery = this.deliveries.filter(
        (delivery) =>
          delivery.customer.lastname
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          delivery.customer.firstname
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          delivery.num.toString().includes(this.searchQuery)
      );
    }
  
    deleteDelivery(id: string) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        enterAnimationDuration: '100ms',
        exitAnimationDuration: '100ms',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirm') {
          this.auth.authState$.subscribe((user) => {
            if (user) {
              this.deliveryService.deleteDelivery(id, user.uid);
            }
          });
        }
      });
    }

    
  }


