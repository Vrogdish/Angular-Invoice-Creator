import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { Subscription } from 'rxjs';
import { CustomersService } from '../customers/services/customers.service';
import { ProductsService } from '../products/services/products.service';
import { InvoiceService } from '../invoice/services/invoice.service';
import { ProfileService } from '../profile/services/profile.service';
import { SettingsService } from '../settings/services/settings.service';

@Component({
  selector: 'app-provider',
  standalone: true,
  imports: [],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss',
})
export class ProviderComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private customerService: CustomersService,
    private productService: ProductsService,
    private invoiceService: InvoiceService,
    private profilService: ProfileService,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.authState$.subscribe((user) => {
        if (user) {
          this.customerService.loadCustomers(user.uid!);
          this.productService.loadProducts(user.uid!);
          this.invoiceService.loadInvoices(user.uid!);
          this.profilService.loadProfile(user.uid!);
          this.settingService.loadSettings(user.uid!);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
