import { Component, OnInit } from '@angular/core';
import { Product } from './models/product.model';
import { ProductsService } from './services/products.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject,  } from 'rxjs';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

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
    LoaderComponent
],
})
export class ProductsComponent implements OnInit{
  products$: BehaviorSubject<Product[] | null> = new BehaviorSubject<
    Product[] | null
  >(null);
  searchQuery = '';
  isLoading$!: BehaviorSubject<boolean>;

  constructor(
    private productService: ProductsService,
  ) {}

  ngOnInit() {
    this.isLoading$ = this.productService.isLoading$;
    this.products$ = this.productService.products$;
  }



  onSearch(query: string) {
    this.searchQuery = query;
  }
}
