import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductForm, TvaEnum } from '../../models/product.model';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { TvaPipe } from "../../../../shared/pipes/tva.pipe";

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  imports: [ReactiveFormsModule, BtnComponent, RouterLink, CommonModule, TvaPipe],
})
export class ProductFormComponent implements OnInit {
  @Input() product!: Product | null;
  productForm: FormGroup<ProductForm> = new FormGroup<ProductForm>({
    reference: new FormControl(''),
    name: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    description: new FormControl(''),
    tva: new FormControl(TvaEnum.Normal),
  });
  isLoading$ = this.productService.isLoading$;
  errorMessages!: string;
  editMode = false;
  tvaSelect : number[] = [TvaEnum.Normal, TvaEnum.intermediaire, TvaEnum.reduit, TvaEnum.particulier]; 

  constructor(
    private productService: ProductsService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((url) => {
      if (url[1].path === 'detail') {
        this.editMode = true;
        if (this.product) {
          this.productForm.patchValue({
            ...this.product,
            price: this.product.price,
          });
        }
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.errorMessages = 'Veuillez remplir tous les champs obligatoires.';
      return;
    } else {
      this.errorMessages = '';
    }

    this.auth.authState$.subscribe((user) => {
      if (user) {
        if (this.editMode && this.product) {
          this.productService.updateProduct(
            user.uid,
            this.product.id,
            this.productForm
          );
        } else {
          this.productService.addProduct(user.uid, this.productForm);
        }
      }
      this.productService.errorMessages$.subscribe((error) => {
        if (error) {
          this.errorMessages = error;
        }
      });
    });
    if (!this.errorMessages) {
      this.router.navigate(['/products']);
    }
  }
}
