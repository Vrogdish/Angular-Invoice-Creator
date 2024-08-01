import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private auth = inject(Auth);
  private authState = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.authState.next(user);
    });
  }

 async signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password)
     return { data: userCredential.user };
      
 } catch (error: any) {
      console.error(error);
      return { error: error };
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log(userCredential);
      return { data: userCredential.user };
    } catch (error: any) {
      console.error(error);
      return { error: error };
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      console.log('sign out sucessful');
    } catch (error: any) {
      console.error(error);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { data: 'Email sent' };
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }

  get authState$() {
    return this.authState.asObservable();
  }
}
