import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../products/models/product.model';
import { ProductsService } from '../../../products/services/products.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { BtnComponent } from "../../../../shared/components/btn/btn.component";
import { Invoice, InvoiceForm } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-select-products',
    standalone: true,
    templateUrl: './select-products.component.html',
    styleUrl: './select-products.component.scss',
    imports: [CommonModule, NgSelectModule, FormsModule, BtnComponent, MatTableModule]
})
export class SelectProductsComponent implements OnInit {
  products$!: BehaviorSubject<Product[] | null>;
  invoice$!: BehaviorSubject<InvoiceForm >;
  selectedProduct!: Product | null;
  displayedColumns: string[] = [
    'ref',
    'name',
    'price',
    'quantity',
    'delete',
  ];
  quantity = 1;
  errorMessage$ = this.invoiceService.errorMessage$;

  constructor(
    private productsService: ProductsService,
    private invoiceService: InvoiceService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.productsService.loadProducts(user.uid);
      }
    });
    this.products$ = this.productsService.products$;
    this.invoice$ = this.invoiceService.invoice$;
  }

  addProduct(): void {
    if (!this.selectedProduct) {
      return;
    }
    this.invoiceService.addProduct(this.selectedProduct, this.quantity);
    this.selectedProduct = null;
  }

  removeProduct(id  : string): void {
    this.invoiceService.removeProduct(id);
  }

  incrementQuantity(id : string): void {
   this.invoiceService.incrementQuantity(id);
  }

  decrementQuantity(id : string): void {
    this.invoiceService.decrementQuantity(id);
  }
}
