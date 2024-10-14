import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Delivery } from '../../models/delivery.model';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';

import { DeliveryService } from '../../services/delivery.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';


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
export class DeliveryListComponent implements OnChanges {
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

  constructor(
    private dialog: MatDialog,
    private deliveryService: DeliveryService,
    private auth: AuthService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
      if (changes['deliveries'] || changes['searchQuery']) {
        this.filterDelivery();
      }
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


