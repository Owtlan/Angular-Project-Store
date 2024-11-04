// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private totalSum = new BehaviorSubject<number>(0)
  private userId: string | null = null;

  cartCount$ = this.cartCount.asObservable();
  totalSum$ = this.totalSum.asObservable()

  constructor() {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      this.userId = savedUserId;
      this.loadCart();
    }
  }
  setUserId(userId: string | null): void {
    this.userId = userId;
    if (userId) {
      this.loadCart();
      localStorage.setItem('userId', userId);
    } else {
      this.clearCart();
      localStorage.removeItem('userId');
    }
  }

  private loadCart(): void {
    if (this.userId) {
      const savedCart = localStorage.getItem(`cart_${this.userId}`);
      this.cart = savedCart ? JSON.parse(savedCart) : [];
      this.cartCount.next(this.cart.length);
      this.updateTotalSum();
    }
  }

  private saveCart(): void {
    if (this.userId) {
      localStorage.setItem(`cart_${this.userId}`, JSON.stringify(this.cart));
    }
  }


  addToCart(product: Product): void {
    this.cart.push(product);
    this.cartCount.next(this.cart.length); // Актуализираме броя на продуктите в количката
    this.updateTotalSum()
    this.saveCart();
  }

  getCart(): Product[] {
    return this.cart;
  }

  getCartCount(): number {
    return this.cart.length;
  }

  removeFromCart(product: Product): void {
    const index = this.cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.cartCount.next(this.cart.length);
      this.updateTotalSum();
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cart = []
    this.cartCount.next(this.cart.length);
    this.totalSum.next(0);
    if (this.userId) {
      localStorage.removeItem(`cart_${this.userId}`);
    }
  }

  private updateTotalSum(): void {
    const sum = this.cart.reduce((total, product) => total + product.price, 0)
    this.totalSum.next(sum);
  }

}
