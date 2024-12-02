import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.model';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../auth/auth.service';
import { faCartShopping, faHeart, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })) 
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: '0px', opacity: 0 })) 
      ])
    ])
  ]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  currentUserId: string | null = null;
  selectedImageUrl: string | null = null;
  faCartShopping = faCartShopping;
  faHeart = faHeart;
  faThumbsDown = faThumbsDown;
  isImageChanged = false;
  showSuccessMessage: boolean = false;
  showFullDescription = false;



  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: Auth,
    private router: Router
  ) { }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }


  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      this.currentUserId = user ? user.uid : null;
    });

    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }


  onLikeClick(product: Product) {
    if (this.currentUserId && !this.isProductOwner(product)) {
      this.productService.toggleLike(product.id, this.currentUserId).catch((err) =>
        console.error('Error liking product:', err)
      );
    }
  }

  onDislikeClick(product: Product) {
    if (this.currentUserId && !this.isProductOwner(product)) {
      this.productService.toggleDislike(product.id, this.currentUserId).catch((err) =>
        console.error('Error disliking product:', err)
      );
    }
  }

  loadProductDetails(productId: string) {
    this.productService.getProductById(productId).subscribe(
      (data: Product) => {
        if (!data) {
          this.router.navigate(['/']);
          return;
        }


        this.product = data;
        this.selectedImageUrl = data.imageUrl;
      },
      (error) => {
        console.error('Error loading product details:', error);
        this.router.navigate(['/']);
      }
    );
  }

  selectColorImage(imageUrl: string) {

    if (!this.product) {
      console.warn('Продуктът не е наличен за промяна на изображението');
      return;
    }


    const previousImage = this.selectedImageUrl;


    if (imageUrl === 'original') {
      this.selectedImageUrl = this.product?.imageUrl || '';
    } else {
      this.selectedImageUrl = imageUrl
    }

    if (this.selectedImageUrl !== previousImage) {
      this.isImageChanged = true;
    }

  }

  selectAdditionalImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.isImageChanged = true;
  }

  
  resetAnimation() {
    this.isImageChanged = false;
  }



  isProductOwner(product: Product): boolean {
    return product.ownerId === this.currentUserId;
  }

  editProduct(product: Product) {
    this.router.navigate(['/product/edit', product.id]);
  }


  onBuyClick(product: Product): void {
    if (this.authService.isLoggedIn()) {
      this.addToCart(product);
    } else {
      alert('Please log in or register to add the product to your cart.');
      this.router.navigate(['/login'])
    }
  }




  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log(`Product added to the cart.: ${product.name}`);
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id).then(() => {
      console.log('Продуктът е изтрит');
      this.router.navigate(['/']);
    }).catch((error) => {
      console.error('Грешка при изтриване на продукта:', error);
      alert('Не успяхме да изтрием продукта. Моля, опитайте по-късно.');
      this.router.navigate(['/']);
    });
  }

}
