import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignInComponent } from './core/auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './core/auth/pages/sign-up/sign-up.component';
import { authGuard } from './core/auth/guard/auth.guard';
import { ResetComponent } from './core/auth/pages/reset/reset.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProfileFormComponent } from './features/profile/components/profile-form/profile-form.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
import { CustomersComponent } from './features/customers/customers.component';
import { CustomerFormComponent } from './features/customers/components/customer-form/customer-form.component';
import { InvoiceComponent } from './features/invoice/invoice.component';
import { PdfPreviewComponent } from './features/invoice/components/pdf-preview/pdf-preview.component';
import { SettingsComponent } from './features/settings/settings.component';
import { InvoiceCreatorComponent } from './features/invoice/components/invoice-creator/invoice-creator.component';
import { InvoiceDetailComponent } from './features/invoice/components/invoice-detail/invoice-detail.component';
import { DeliveryComponent } from './features/delivery/delivery.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signin',
    component: SignInComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile/edit',
    component: ProfileFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reset',
    component: ResetComponent,
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'products/add',
    component: ProductFormComponent
  },
  {
    path : 'customers',
    component: CustomersComponent
  },
  {
    path: 'customers/add',
    component: CustomerFormComponent
  },
  {
    path: 'invoice',
    component: InvoiceComponent
  },
  {
    path: 'invoice/:id',
    component: InvoiceDetailComponent
  },
  {
    path: 'invoice/create',
    component: InvoiceCreatorComponent
  },

  {
    path: 'invoice/preview',
    component: PdfPreviewComponent
  },
  {
    path: 'delivery',
    component: DeliveryComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
];
