import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatDialogModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnChanges {
  @Input() products: Product[] = [];
  @Input() searchQuery = '';
  filteredProducts: Product[] = [];
  displayedColumns: string[] = [
    'ref',
    'name',
    'price',
    'description',
    'delete',
  ];

  constructor(private dialog: MatDialog, private product: ProductsService, private auth : AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] || changes['searchQuery']) {
      this.filterProducts();
    }
  }

  private filterProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  deleteProduct(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '100ms',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.auth.authState$.subscribe((user) => {
          if (user) {
            this.product.deleteProduct(id, user.uid);
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
  styleUrl: './products-list.component.scss',
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
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
