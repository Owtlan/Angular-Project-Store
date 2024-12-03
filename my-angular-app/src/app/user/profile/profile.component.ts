import { Component, OnInit, Output, ElementRef,ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  profilePictureUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; 


  constructor(
    private auth: Auth,
    private userService: UserService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const user = this.auth.currentUser;
  
    if (user) {

      this.currentUser = {
        email: user.email,
        phone: user.phoneNumber || null, 
        photoURL: user.photoURL,
        uid: user.uid,
      };
  
      if (!this.currentUser.phone) {
        this.userService.getFirestoreUser(user.uid).then((data) => {
          if (data?.phone) {
            this.currentUser.phone = data.phone;
          } else {
            this.currentUser.phone = 'Not provided';
          }
        });
      }
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
      console.error("Error loading the picture from Firestore:", error);
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
        console.error('Error uploading image:', error);
      }
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click(); 
  }
}
