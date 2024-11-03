import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartService } from '../services/cart.service';
import { Auth, authState } from '@angular/fire/auth';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userEmail: string | null = null;
  cartCount: number = 0;
  faCartShopping = faCartShopping;

  
  constructor(private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private auth: Auth) { }

  ngOnInit(): void {
    // Наблюдавай състоянието на потребителя, за да вземем имейла
    authState(this.auth).subscribe(user => {
      this.userEmail = user ? user.email : null;
    });

    // Вземи броя на продуктите в количката
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }



  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout()
    this.navigateTo('/')
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

}
