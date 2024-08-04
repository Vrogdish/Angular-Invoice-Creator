import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Invoice, InvoiceForm } from '../../models/invoice.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Component({
  selector: 'app-pdf-delivery-preview',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule, CommonModule, PdfViewerModule],
  templateUrl: './pdf-delivery-preview.component.html',
  styleUrl: './pdf-delivery-preview.component.scss',
})
export class PdfDeliveryPreviewComponent implements OnInit {
  @Input({required:true}) invoice!: InvoiceForm | Invoice;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  pdfSrc!: any;

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    this.updatePdfSrc();
  }

  
  downloadPdf() {
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).download();
  }

  openPdf() {
    const documentDefinition = this.getDocDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  updatePdfSrc() {
    if (!this.invoice) {
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
        { text: 'Bon de livraison', style: 'header' },
        { text: 'N° ' + this.invoice.num, margin: [0, 0, 0, 30] },
        {
          columns: [{ text: 'Vendeur : ' }, { text: 'Client: ' }],
          style: 'adressTitle',
        },

        {
          columns: [
            {
              text:
                this.invoice.vendor.company +
                '\n' +
                this.invoice.vendor.civility +
                ' ' +
                this.invoice.vendor.firstname +
                ' ' +
                this.invoice.vendor.lastname +
                '\n' +
                this.invoice.vendor.address +
                '\n' +
                this.invoice.vendor.postalCode +
                ' ' +
                this.invoice.vendor.city,
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
                this.invoice.customer?.city,
            },
          ],
          style: 'adress',
          alignment: 'justify',
        },

        {
          text:
            'Date de création du bon : ' + this.invoice.createdAt.toLocaleDateString(),
          margin: [0, 0, 0, 30],
        },

        {
          table: {
            widths: [60, '*', 100, 60, 100],
            body: [
              [
                'Ref',
                'Article',
                
                'Quantité',
                
              ],
              ...this.invoice.productsList.map((product) => [
                product.product.reference,
                product.product.name,
             
                product.quantity,
              
              ]),
            ],
          },
          style: 'table',
        },

        
    
      ],
      footer: () => {
        return {
          columns: [
            {
              text:
                'Société : ' +
                this.invoice.vendor.company +
                '  -  ' +
                'Téléphone : ' +
                this.invoice.vendor.phone +
                '  -  ' +
                'Email : ' +
                this.invoice.vendor.email,
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
