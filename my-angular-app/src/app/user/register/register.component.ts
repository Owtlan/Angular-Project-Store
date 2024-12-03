import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  firstname: string = '';
  lastname: string = '';
  phone: string = '';
  password: string = '';
  rePass: string = '';
  errorMessage: string = ''

  constructor(private auth: Auth, private userService: UserService, private router: Router, private messageService: MessageService) { }

  async register() {

    if (this.password !== this.rePass) {
      console.log('passwords do not match.')
      return
    }

    const emailOrPhoneExists = await this.userService.checkIfEmailOrPhoneExists(this.email, this.phone)

    if (emailOrPhoneExists) {
      this.errorMessage = 'This email or phone number already exists.';
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        const user: User = userCredential.user;

        this.userService.addUser(user, { phone: this.phone }).then(() => {
          console.log("User added successfully");
        }).catch(error => {
          console.error("Error adding user: ", error);
        });

        this.messageService.setMessage(`Welcome, ${this.email}!`);

      this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            this.messageService.clearMessage();
          }, 5000);
        });
        console.log('Registration successful:', user);
      })
      .catch(error => {
        console.log('Registration error:', error);
      });
  }
}
