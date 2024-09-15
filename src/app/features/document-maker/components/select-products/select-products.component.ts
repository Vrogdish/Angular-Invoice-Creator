import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../products/models/product.model';
import { ProductsService } from '../../../products/services/products.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { MatTableModule } from '@angular/material/table';
import { DocumentDetail } from '../../models/document-detail.model';
import { DocumentMakerService } from '../../services/document-maker.service';

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
  documentDetail$!: BehaviorSubject<DocumentDetail>;
  selectedProduct!: Product | null;
  displayedColumns: string[] = ['ref', 'name', 'price', 'quantity', 'delete'];
  quantity = 1;
  errorMessage$!: BehaviorSubject<string>;

  constructor(
    private productsService: ProductsService,
    private documentMakerService: DocumentMakerService,
  ) {}

  ngOnInit(): void {
    this.products$ = this.productsService.products$;
    this.documentDetail$ = this.documentMakerService.documentDetail$;
  }

  addProduct(): void {
    if (!this.selectedProduct) {
      return;
    }
    this.documentMakerService.addProduct(this.selectedProduct, this.quantity);
    this.selectedProduct = null;
    this.quantity = 1;
  }

  removeProduct(id: string): void {
    this.documentMakerService.removeProduct(id);
  }

  incrementQuantity(id: string): void {
    this.documentMakerService.incrementQuantity(id);
  }

  decrementQuantity(id: string): void {
    this.documentMakerService.decrementQuantity(id);
  }

  previous() {
    this.documentMakerService.setStep(1);
  }

  next() {
    this.documentMakerService.setStep(3);
  }
}
