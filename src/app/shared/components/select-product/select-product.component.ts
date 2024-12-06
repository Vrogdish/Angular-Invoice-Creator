import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../../features/products/services/products.service';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { Product } from '../../../features/products/models/product.model';
import { FormGroup, FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cartItem.model';
import { BtnComponent } from '../btn/btn.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-product',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    BtnComponent,
    MatTableModule,
  ],
  templateUrl: './select-product.component.html',
  styleUrl: './select-product.component.scss',
})
export class SelectProductComponent implements OnInit {
  @Output() addCartItemEmitter: EventEmitter<CartItem> =
    new EventEmitter<CartItem>();
  @Output() removeCartItemEmitter: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() updateProductQuantityEmitter: EventEmitter<{
    index: number;
    quantity: number;
  }> = new EventEmitter<{ index: number; quantity: number }>();
  @Input() form!: FormGroup;
  @Input() totalAmount = 0;
  products$!: BehaviorSubject<Product[] | null>;
  selectedProduct!: Product | null;
  displayedColumns: string[] = ['ref', 'name', 'price', 'quantity', 'delete'];
  quantity = 1;
  cart$!: Observable<CartItem[]> | undefined;
  errorMessage: string | null = null;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.cart$ = this.form.get('productsList')?.valueChanges.pipe(
      startWith(this.form.get('productsList')?.value || []),
      map((cart: CartItem[]) => {
        return cart.map((cartItem, index) => {
          return {
            ...cartItem,
            index,
          };
        });
      })
    );

  }

  private productIsPresent(product: Product): boolean {
    return this.form
      .get('productsList')
      ?.value.some((item: CartItem) => item.product.id === product.id);
  }

  addProduct(): void {
    if (!this.selectedProduct) {
      return;
    }
    if (this.productIsPresent(this.selectedProduct)) {
      this.errorMessage = 'Product déja ajouté';
      return;
    }
    this.addCartItemEmitter.emit({
      product: this.selectedProduct,
      quantity: this.quantity,
    });
    this.selectedProduct = null;
    this.quantity = 1;
    this.errorMessage = null;
  }

  removeProduct(index: number): void {
    this.removeCartItemEmitter.emit(index);
  }

  incrementQuantity(index: number): void {
    this.updateProductQuantityEmitter.emit({ index, quantity: 1 });
  }

  decrementQuantity(index: number): void {
    this.updateProductQuantityEmitter.emit({ index, quantity: -1 });
  }
}
