import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Customer } from '../../models/customer.model';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CustomersService } from '../../services/customers.service';
import { MatButtonModule } from '@angular/material/button';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dialog-customers',
  templateUrl: 'dialog-customers.component.html',
  styleUrl: './customers-list.component.scss',
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
export class DialogCustomerComponent {
  constructor(public dialogRef: MatDialogRef<DialogCustomerComponent>) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
    
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}


@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatDialogModule,RouterLink],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.scss',
})
export class CustomersListComponent implements OnChanges {
  @Input() customers: Customer[] = [];
  @Input() searchQuery = '';
  filteredCustomers: Customer[] = [];
  displayedColumns: string[] = ['name', 'email', 'address', 'phone', 'delete'];

  constructor(
    private dialog: MatDialog,
    private customerService: CustomersService,
    private auth: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customers'] || changes['searchQuery']) {
      this.filterCustomers();
    }
  }

  private filterCustomers() {
    this.filteredCustomers = this.customers.filter(
      (customer) =>
        customer.firstname
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteCustomer(id: string) {
    const dialogRef = this.dialog.open(DialogCustomerComponent, {
      width: '350px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.auth.authState$.subscribe((user) => {
          if (user) {
            this.customerService.deleteCustomer(id, user.uid);
          }
        });
      }
    });
  }
}

