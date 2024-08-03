import { Injectable, inject } from '@angular/core';
import { Customer, CustomerForm } from '../models/customer.model';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  customers$ = new BehaviorSubject<Customer[] | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessages$ = new BehaviorSubject<string | null>(null);

  firestore = inject(Firestore);

  async loadCustomers(uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'customers');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const customers: Customer[] = [];
      querySnapshot.forEach((doc) => {
        customers.push({ ...doc.data(), id: doc.id } as Customer);
      });
      this.customers$.next(customers);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next(
        'Impossible de charger les clients. Veuillez réessayer.'
      );
    }
    this.isLoading$.next(false);
  }

  async addCustomer(uid: string, customer: FormGroup<CustomerForm>) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'customers');
      await addDoc(collectionRef, {
        ...customer.value,
        uid,
      });
      this.loadCustomers(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next(
        "Impossible d'ajouter le client. Veuillez réessayer."
      );
    }

    this.isLoading$.next(false);
  }

  async updateCustomer(id: string, customer: FormGroup<CustomerForm>) {
    // Update a customer
  }

  async deleteCustomer(id: string, uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'customers');
      await deleteDoc(doc(collectionRef, id));
      this.loadCustomers(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next(
        'impossible de supprimer le client. Veuillez réessayer.'
      );
    } finally {
      this.isLoading$.next(false);
    }
  }
}
