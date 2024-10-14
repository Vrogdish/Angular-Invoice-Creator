import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-invoices',
  templateUrl: 'dialog.component.html',
  styleUrl: './invoices-list.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    BtnComponent,
    CommonModule,
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
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatDialogModule,
    RouterLink,
    DialogComponent,
    CommonModule,
  ],
  templateUrl: './invoices-list.component.html',
  styleUrl: './invoices-list.component.scss',
})
export class InvoicesListComponent implements OnChanges {
  @Input() invoices: Invoice[] = [];
  @Input() searchQuery = '';
  filteredInvoices: Invoice[] = [];
  displayedColumns: string[] = [
    'number',
    'date',
    'customer',
    'total',
    'delete',
  ];

  constructor(
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private auth: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['invoices'] || changes['searchQuery']) {
      this.filterInvoices();
    }
  }

  private filterInvoices() {
    this.filteredInvoices = this.invoices.filter(
      (invoice) =>
        invoice.customer.lastname
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        invoice.customer.firstname
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        invoice.num.toString().includes(this.searchQuery)
    );
  }

  deleteInvoice(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.auth.authState$.subscribe((user) => {
          if (user) {
            this.invoiceService.deleteInvoice(id, user.uid);
          }
        });
      }
    });
  }
}
