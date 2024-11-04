import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  filters = { productName: '', category: '', price: null };
  userId: string | null = null
  faCartShopping = faCartShopping;


  constructor(private productService: ProductService, private auth: Auth, private router: Router, private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadProducts();

    authState(this.auth).subscribe(user => {
      this.userId = user ? user.uid : null;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesName = this.filters.productName
        ? product.name.toLowerCase().includes(this.filters.productName.toLowerCase())
        : true;
      const matchesCategory = this.filters.category
        ? product.category === this.filters.category
        : true;

      let matchesPrice = true;
      if (this.filters.price) {
        const [minPrice, maxPrice] = this.getPriceRange(this.filters.price);
        matchesPrice = maxPrice
          ? product.price >= minPrice && product.price <= maxPrice
          : product.price >= minPrice;
      }

      return matchesName && matchesCategory && matchesPrice;
    });
  }


  getPriceRange(priceRange: string): [number, number | null] {
    switch (priceRange) {
      case '0-99':
        return [0, 99];
      case '100-199':
        return [100, 199];
      case '200-299':
        return [200, 299];
      case '300-399':
        return [300, 399];
      case '400-499':
        return [400, 499];
      case '500-1000':
        return [500, 1000];
      case '1000+':
        return [1000, null]; // Без горна граница за продукти над 1000 лв
      default:
        return [0, null];
    }
  }



  clearFilters(): void {
    this.filters = { productName: '', category: '', price: null };
    this.applyFilters();
  }
  goToDetail(productId: string | undefined) {
    if (productId) {
      this.router.navigate(['/product', productId]);
    } else {
      console.error('Product ID is undefined');
    }
  }

  addToCart(product: Product): void {
    if (product.ownerId === this.userId) {
      console.log(`Не можете да добавите продукт, тъй като вие сте създателя: ${product.name}`);
      return; // Не позволявайте добавяне на продукта в количката
    }

    this.cartService.addToCart(product);
    console.log(`Добавен продукт в количката: ${product.name}`);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


}
