import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private userService: UserService, private router: Router) { }

  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        const user: User = userCredential.user;

        this.userService.addUser(user);
        this.router.navigate(['/'])
        console.log('Registration successful:', user);
      })
      .catch(error => {
        console.log('Registration error:', error);
      })
  }

}
