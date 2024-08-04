import { Injectable, inject } from '@angular/core';
import { Product, ProductForm } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';
import {
  Firestore,
  addDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products$ = new BehaviorSubject<Product[] | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessages$ = new BehaviorSubject<string | null>(null);

  firestore = inject(Firestore);

  async loadProducts(uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'products');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id } as Product);
      });
      this.products$.next(products);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't load products. Please try again.");
    }
    this.isLoading$.next(false);
  }

  async addProduct(uid: string, product: FormGroup<ProductForm>) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = collection(this.firestore, 'products');
      await addDoc(collectionRef, {
        ...product.value,
        uid,
      });
      this.loadProducts(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't add product. Please try again.");
    }

    this.isLoading$.next(false);
  }

  async updateProduct(uid : string ,id: string, product: FormGroup<ProductForm>) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      const collectionRef = doc(this.firestore, 'products', id);
      await updateDoc(collectionRef, {
        name: product.get('name')?.value,
        description: product.get('description')?.value,
        price: product.get('price')?.value,
        reference: product.get('reference')?.value,
      })
      this.loadProducts(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Impossible de mettre à jour le produit. Veuillez réessayer.");
    }
    this.isLoading$.next(false);

  }

  async deleteProduct(id: string, uid: string) {
    this.isLoading$.next(true);
    this.errorMessages$.next(null);
    try {
      await deleteDoc(doc(this.firestore, 'products', id));
      this.loadProducts(uid);
    } catch (error) {
      console.error(error);
      this.errorMessages$.next("Couldn't delete product. Please try again.");
    }
    this.isLoading$.next(false);
  }

  getProductById(id: string) {
    const products = this.products$.value;
    if (!products) {
      return null;
    }
    return products.find((product) => product.id === id) || null;
  }
}
