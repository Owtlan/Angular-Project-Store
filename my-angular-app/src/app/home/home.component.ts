import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

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



  constructor(private productService: ProductService, private auth: Auth, private router: Router, private cartService: CartService) { }

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
      const matchesPrice = this.filters.price ? product.price <= this.filters.price : true;
      return matchesName && matchesCategory && matchesPrice;
    });
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




}
