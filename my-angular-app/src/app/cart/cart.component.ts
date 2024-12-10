import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart(); 
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0)
  }
  removeFromCart(item: Product): void {
    this.cartService.removeFromCart(item); 
    this.cartItems = this.cartService.getCart(); 
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
    // this.router.navigate(['/']);
  }
}
