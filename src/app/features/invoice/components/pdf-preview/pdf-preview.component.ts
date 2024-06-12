import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { ProfileService } from '../../../profile/services/profile.service';
import { UserProfile } from '../../../profile/models/userProfile.model';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BtnComponent } from '../../../../shared/components/btn/btn.component';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  templateUrl: './pdf-preview.component.html',
  styleUrl: './pdf-preview.component.scss',
  imports: [
    NgxExtendedPdfViewerModule,
    CommonModule,
    PdfViewerModule,
    BtnComponent,
  ],
})
export class PdfPreviewComponent implements OnInit {
  invoice!: Invoice;
  profile!: UserProfile | null;
  pdfSrc!: any;
  tauxTVA: number = 0.2;
  totalHT!: number;
  totalTva!: number;
  totalTTC!: number;
  todaysDate = new Date();

  constructor(
    private invoiceService: InvoiceService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.invoiceService.invoice$.subscribe((invoice) => {
      this.invoice = invoice;
    });
    this.profileService.profile$.subscribe((profile) => {
      this.profile = profile;

      this.totalHT = this.invoiceService.getTotalHT();
      this.totalTva = this.totalHT * this.tauxTVA;
      this.totalTTC = this.totalHT + this.totalTva;
      this.updatePdfSrc();
    });
  }

  downloadPdf() {
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).download();
  }

  updatePdfSrc() {
    if (!this.invoice || !this.profile) {
      return;
    }
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).getBuffer((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      this.pdfSrc = URL.createObjectURL(blob);
    });
  }

  getDocDefinition(): TDocumentDefinitions {
    return {
      content: [
        { text: 'Facture', style: 'header' },
        {
          columns: [{ text: 'Vendeur : ' }, { text: 'Client: ' }],
          style: 'adressTitle',
        },

        {
          columns: [
            {
              text:
                this.profile?.company +
                '\n' +
                this.profile?.civility +
                ' ' +
                this.profile?.firstname +
                ' ' +
                this.profile?.lastname +
                '\n' +
                this.profile?.address +
                '\n' +
                this.profile?.postalCode +
                ' ' +
                this.profile?.city,
            },
            {
              text:
                this.invoice.customer?.company +
                '\n' +
                this.invoice.customer?.civility +
                ' ' +
                this.invoice.customer?.firstname +
                ' ' +
                this.invoice.customer?.lastname +
                '\n' +
                this.invoice.customer?.address +
                '\n' +
                this.invoice.customer?.postalCode +
                ' ' +
                this.invoice.customer?.locality,
            },
          ],
          style: 'adress',
          alignment: 'justify',
        },

        {
          text: 'Date de facturation : ' + this.todaysDate.toLocaleDateString(),
          margin: [0, 0, 0, 30],
        },

        {
          table: {
            widths: [60, '*', 100, 60, 100],
            body: [
              [
                'Ref',
                'Article',
                'Prix unitaire HT',
                'Quantité',
                'Prix total HT',
              ],
              ...this.invoice.productsList.map((product) => [
                product.product.reference,
                product.product.name,
                product.product.price.toFixed(2) + ' €',
                product.quantity,
                (product.product.price * product.quantity).toFixed(2) + ' €',
              ]),
            ],
          },
          style: 'table',
        },

        {
          text:
            'Total HT: ' +
            this.totalHT.toFixed(2) +
            ' €\nTVA (20.00%): ' +
            this.totalTva.toFixed(2) +
            ' €\nTotal TTC: ' +
            this.totalTTC.toFixed(2) +
            ' €',
          alignment: 'right',
          margin: [0, 30, 0, 0],
        },
        {
          text: 'Merci de votre confiance',
        },
      ],
      footer: () => {
        return {
          columns: [
            {
              text:
                'Société : ' +
                this.profile?.company +
                '  -  ' +
                'Téléphone : ' +
                this.profile?.phoneNumber +
                '  -  ' +
                'Email : ' +
                this.profile?.email,
              style: 'footer',
            },
          ],
          margin: [40, 0],
        };
      },

      styles: {
        header: {
          fontSize: 40,
          bold: true,
          margin: [0, 0, 0, 60],
        },
        adress: {
          margin: [0, 0, 0, 60],
        },
        adressTitle: {
          margin: [0, 0, 0, 10],
          fontSize: 16,
          bold: true,
        },

        footer: {
          fontSize: 10,
          margin: [10, 0, 10, 0],
        },
      },
    };
  }
}
