import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    CommonModule,
    BtnComponent,
    ProductsListComponent,
    SearchBarComponent,
    RouterLink,
  ],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products$: BehaviorSubject<Product[] | null> = new BehaviorSubject<
    Product[] | null
  >(null);
  searchQuery: string = '';
  subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.auth.authState$.subscribe((user) => {
        this.productService.loadProducts(user?.uid!);
      })
    );
    this.products$ = this.productService.products$;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }
}
