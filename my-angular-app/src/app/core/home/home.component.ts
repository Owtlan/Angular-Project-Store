import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth/auth.service';
import { SwiperOptions } from 'swiper/types';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  swiperProducts: Product[] = [];
  lastAddedProduct: Product | null = null;

  filters = {
    productName: '',
    category: '',
    price: null,
    onlyLiked: false,
    likesRange: { '1-2': false, '3-4': false, '5-6': false }
  };

  userId: string | null = null;
  currentUserId: string | null = null;

  isLoading: boolean = true;
  showSuccessMessage: boolean = false;

  faCartShopping = faCartShopping;
  faHeart = faHeart;

  swiperConfig: SwiperOptions = {
    navigation: true,
    pagination: { clickable: true, type: 'bullets', el: '.swiper-pagination' },
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
  };

  filters$ = new BehaviorSubject<{
    productName: string;
    category: string;
    price: string | null;
    onlyLiked: boolean;
  }>({
    productName: '',
    category: '',
    price: null,
    onlyLiked: false
  });

  filteredProducts$ = new BehaviorSubject<Product[]>([]);

  constructor(
    private productService: ProductService,
    private auth: Auth,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupAuthListener();
    this.setupReactiveFilters();
  }


  private setupAuthListener(): void {
    authState(this.auth).subscribe(user => {
      this.userId = user ? user.uid : null;
    });
  }


  private setupReactiveFilters(): void {
    combineLatest([this.filters$, this.productService.getProducts()])
      .pipe(
        map(([filters, products]) => this.filterProducts(filters, products))
      )
      .subscribe(filteredProducts => this.filteredProducts$.next(filteredProducts));
  }

  private loadProducts(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.swiperProducts = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    );
  }


  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => this.matchesFilters(product));
  }


  applyReactiveFilters(): void {
    this.filters$.next({ ...this.filters });
  }


  private matchesFilters(product: Product): boolean {
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

    const matchesLikes = this.filters.onlyLiked
      ? product.likes?.includes(this.currentUserId || '')
      : true;

    const matchesLikesRange = this.getLikesRangeMatch(product.likes?.length || 0);

    return matchesName && matchesCategory && matchesPrice && matchesLikes && matchesLikesRange;
  }


  private filterProducts(filters: any, products: Product[]): Product[] {
    return products.filter(product => this.matchesFilters(product));
  }


  private getLikesRangeMatch(likesCount: number): boolean {
    const ranges = this.filters.likesRange;
    if (ranges['1-2'] && likesCount >= 1 && likesCount <= 2) return true;
    if (ranges['3-4'] && likesCount >= 3 && likesCount <= 4) return true;
    if (ranges['5-6'] && likesCount >= 5 && likesCount <= 6) return true;
    return Object.values(ranges).every(value => value === false);
  }

  
  private getPriceRange(priceRange: string): [number, number | null] {
    switch (priceRange) {
      case '0-99': return [0, 99];
      case '100-199': return [100, 199];
      case '200-299': return [200, 299];
      case '300-399': return [300, 399];
      case '400-499': return [400, 499];
      case '500-1000': return [500, 1000];
      case '1000+': return [1000, null];
      default: return [0, null];
    }
  }


  clearFilters(): void {
    this.filters = {
      productName: '',
      category: '',
      price: null,
      onlyLiked: false,
      likesRange: { '1-2': false, '3-4': false, '5-6': false }
    };
    this.applyFilters();
  }


  goToDetail(productId: string | undefined): void {
    if (productId) {
      this.router.navigate(['/product', productId]);
    } else {
      console.error('Product ID is undefined');
    }
  }


  addToCart(product: Product): void {
    if (product.ownerId === this.userId) {
      console.log(`Cannot add your own product: ${product.name}`);
      return;
    }

    this.cartService.addToCart(product);
    console.log(`Added product to cart: ${product.name}`);

    this.lastAddedProduct = product;
    this.showSuccessMessage = true;
    setTimeout(() => (this.showSuccessMessage = false), 5000);
  }

 
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


  onLikeClick(product: Product): void {
    if (this.currentUserId) {
      this.productService.toggleLike(product.id, this.currentUserId).catch(err =>
        console.error('Error liking product:', err)
      );
    }
  }
}
