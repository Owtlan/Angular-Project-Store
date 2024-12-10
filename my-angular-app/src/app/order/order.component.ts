import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Auth, authState } from '@angular/fire/auth';
import { Order } from '../model/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  userId: string | null = null;

  shippingDetails = {
    address: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  };

  totalPrice: number = 0;
  orderPlaced = false;


  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private auth: Auth,
    private router: Router
  ) {
    authState(this.auth).subscribe(user => {
      this.userId = user ? user.uid : null;
    })
  }

  placeOrder() {
    const productsInCart = this.cartService.getCart()
    this.totalPrice = productsInCart.reduce((total, product) => total + product.price, 0)


    const order: Order = {
      userId: this.userId!,
      products: productsInCart.map(product => ({ productId: product.id, quantity: 1 })),
      totalPrice: this.totalPrice,
      orderDate: new Date(),
      shippingDetails: this.shippingDetails
    }

    this.orderService.createOrder(order)
      .then(() => {
        console.log('Order placed successfully!');

        this.cartService.clearCart();
        this.orderPlaced = true;


        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000);

      })
      .catch(error => {
        console.error('Error placing order:', error);
      });
  }
}
