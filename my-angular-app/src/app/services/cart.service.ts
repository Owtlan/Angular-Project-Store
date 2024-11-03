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

  cartCount$ = this.cartCount.asObservable();


  addToCart(product: Product): void {
    this.cart.push(product);
    this.cartCount.next(this.cart.length); // Актуализираме броя на продуктите в количката
  }

  getCart(): Product[] {
    return this.cart;
  }

  getCartCount(): number {
    return this.cart.length;
  }

  removeFromCart(product: Product): void {
    const index = this.cart.findIndex(item => item.id === product.id); // Предполагаме, че всеки продукт има уникален id
    if (index !== -1) {
      this.cart.splice(index, 1); // Премахваме продукта от масива
      this.cartCount.next(this.cart.length); // Актуализираме броя на продуктите
    }
  }

  clearCart(): void {
    this.cart = []
    this.cartCount.next(this.cart.length);
  }

}
