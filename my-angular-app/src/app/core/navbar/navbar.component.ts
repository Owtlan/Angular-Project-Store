import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../services/cart.service';
import { Auth, authState } from '@angular/fire/auth';
import { faCartShopping, faUser, faHome, faUserPlus, faSignInAlt, faPlusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;
  profilePictureUrl: string | null = null;
  cartCount: number = 0;
  totalSum: number = 0;
  cartItems: any[] = [];
  faCartShopping = faCartShopping;
  faUserIcon = faUser;
  faHome = faHome;
  faUserPlus = faUserPlus;
  faSignInAlt = faSignInAlt;
  faPlusCircle = faPlusCircle;
  faSignOutAlt = faSignOutAlt;

  showUserMenu = false;
  isSticky: boolean = false;

  constructor(private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private auth: Auth,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.userService.getProfilePicture(user.uid).then(profilePicture => {
          this.profilePictureUrl = profilePicture || user.photoURL;
        });
        this.cartService.setUserId(user.uid);
      } else {
        this.userEmail = null;
        this.profilePictureUrl = null;
        this.cartService.setUserId(null);
      }
    });

    this.userService.profilePicture$.subscribe(newProfilePictureUrl => {
      this.profilePictureUrl = newProfilePictureUrl
    })
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
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollPosition > 100) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.userEmail = null;
    this.cartService.setUserId(null);
    this.profilePictureUrl = null;
    this.navigateTo('/');
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }
}
