import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../products/models/product.model';
import { ProductsService } from '../../../products/services/products.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { InvoiceForm } from '../../models/invoice.model';
import { MatTableModule } from '@angular/material/table';
import { InvoiceCreatorService } from '../../services/invoice-creator.service';

@Component({
  selector: 'app-select-products',
  standalone: true,
  templateUrl: './select-products.component.html',
  styleUrl: './select-products.component.scss',
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    BtnComponent,
    MatTableModule,
  ],
})
export class SelectProductsComponent implements OnInit {
  products$!: BehaviorSubject<Product[] | null>;
  invoice$!: BehaviorSubject<InvoiceForm>;
  selectedProduct!: Product | null;
  displayedColumns: string[] = ['ref', 'name', 'price', 'quantity', 'delete'];
  quantity = 1;
  errorMessage$!: BehaviorSubject<string>;

  constructor(
    private productsService: ProductsService,
    private invoiceCreatorService: InvoiceCreatorService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.productsService.loadProducts(user.uid);
      }
    });
    this.products$ = this.productsService.products$;
    this.invoice$ = this.invoiceCreatorService.invoice$;
  }

  addProduct(): void {
    if (!this.selectedProduct) {
      return;
    }
    this.invoiceCreatorService.addProduct(this.selectedProduct, this.quantity);
    this.selectedProduct = null;
    this.quantity = 1;
  }

  removeProduct(id: string): void {
    this.invoiceCreatorService.removeProduct(id);
  }

  incrementQuantity(id: string): void {
    this.invoiceCreatorService.incrementQuantity(id);
  }

  decrementQuantity(id: string): void {
    this.invoiceCreatorService.decrementQuantity(id);
  }

  previous() {
    this.invoiceCreatorService.setStep(1);
  }

  next() {
    this.invoiceCreatorService.setStep(3);
  }
}
