import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductFormComponent } from "../product-form/product-form.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product! : Product | null;
  subscription : Subscription = new Subscription();

  constructor(private activatedRoute : ActivatedRoute, private productService : ProductsService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        this.product = this.productService.getProductById(params['id'])
      
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
