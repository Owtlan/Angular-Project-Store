import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  profilePictureUrl: string | null = null;

  constructor(
    private auth: Auth,
    private userService: UserService,
    private productService: ProductService,
    private router: Router
  ) { }


  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.currentUser = user;
      this.profilePictureUrl = user.photoURL || null; 
      this.loadProfilePicture(user.uid);
    }
  }

  async loadProfilePicture(uid: string) {
    try {
      const profilePicture = await this.userService.getProfilePicture(uid);
      if (profilePicture) {
        this.profilePictureUrl = profilePicture;  
      }
    } catch (error) {
      console.error("Грешка при зареждане на снимката от Firestore:", error);
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await this.productService.uploadImageToCloudinary(file);

        if (this.currentUser) {
          await this.userService.updateProfilePicture(this.currentUser.uid, imageUrl);
          this.profilePictureUrl = imageUrl;  
        }
      } catch (error) {
        console.error('Грешка при качване на изображение:', error);
      }
    }
  }
}
