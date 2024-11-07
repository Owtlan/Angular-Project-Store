import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../services/cart.service';
import { Auth, authState } from '@angular/fire/auth';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userEmail: string | null = null;
  cartCount: number = 0;
  totalSum: number = 0;
  cartItems: any[] = []
  faCartShopping = faCartShopping;
  faUserIcon = faUser;
  showUserMenu = false;

  constructor(private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private auth: Auth) { }

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.cartService.setUserId(user.uid);
      } else {
        this.userEmail = null;
        this.cartService.setUserId(null);
      }
    });


    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.cartService.totalSum$.subscribe(total => {
      this.totalSum = total;
    });
  }



  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout()
    this.userEmail = null;
    this.cartService.setUserId(null);
    this.navigateTo('/')
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item)
  }
}
