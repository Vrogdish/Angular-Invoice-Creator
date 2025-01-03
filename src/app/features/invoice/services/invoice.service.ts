import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  writeBatch,
} from '@angular/fire/firestore';
import { Invoice } from '../models/invoice.model';
import { DeliveryService } from '../../delivery/services/delivery.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  errorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  invoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private firestore: Firestore, private deliverySerice : DeliveryService) {}

  getTotalHT(invoice: Invoice): number {
    const total = invoice.productsList.reduce(
      (acc, product) => acc + product.product.price * product.quantity,
      0
    );
    return total;
  }

  async loadInvoices(uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const q = query(
        collectionRef,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const invoices: Invoice[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Invoice;
        if (data.createdAt instanceof Timestamp) {
          data.createdAt = data.createdAt.toDate();
        }
        invoices.push({ ...data, id: doc.id });
      });
      this.invoices$.next(invoices);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger les factures. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }

  async getInvoiceById(id: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const docRef = doc(collectionRef, id);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data() as Invoice;

      if (data.createdAt instanceof Timestamp) {
        data.createdAt = data.createdAt.toDate();
      }

      return data;
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de charger la facture. Veuillez réessayer.'
      );
      return null;
    } finally {
      this.isLoading$.next(false);
    }
  }

 

  async createInvoice(invoice: Invoice) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      const docRef = await addDoc(collectionRef, {
        ...invoice,
        createdAt: Timestamp.fromDate(new Date()),
      });
      if (invoice.deliveries && invoice.deliveries.length > 0) {
        let batch = writeBatch(this.firestore);

        for (const delivery of invoice.deliveries) {
          const deliveryDocRef = doc(this.firestore, 'deliveries', delivery.id);
          batch.delete(deliveryDocRef);

          await batch.commit();
          batch = writeBatch(this.firestore);
        }
      }
      await this.loadInvoices(invoice.uid);
      await this.deliverySerice.loadDeliveries(invoice.uid);
      return docRef.id;
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de créer la facture ou de supprimer les bons de livraison associés. Veuillez réessayer.'
      );
      return null;
    } finally {
      this.isLoading$.next(false);
    }
  }

  async deleteInvoice(id: string, uid: string) {
    this.isLoading$.next(true);
    this.errorMessage$.next('');
    try {
      const collectionRef = collection(this.firestore, 'invoices');
      await deleteDoc(doc(collectionRef, id));
      await this.loadInvoices(uid);
    } catch (error) {
      console.error(error);
      this.errorMessage$.next(
        'Impossible de supprimer la facture. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }
}
