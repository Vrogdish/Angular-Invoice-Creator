import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductForm } from '../../models/product.model';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink, CommonModule],
})
export class ProductFormComponent {
  productForm: FormGroup<ProductForm> = new FormGroup<ProductForm>({
    reference: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  isLoading$ = this.product.isLoading$;
  errorMessages!: string;

  constructor(
    private product: ProductsService,
    private auth: AuthService,
    private route: Router
  ) {}

  onSubmit() {
    if (this.productForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.auth.authState$.subscribe((user) => {
      if (user) {
        this.product.addProduct(user.uid, this.productForm);
      }

      this.product.errorMessages$.subscribe((error) => {
        if (error) {
          this.errorMessages = error;
        } else {
          this.route.navigate(['/products']);
        }
      });
    });
  }
}
