import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from 'src/app/services/user.service';
import { User } from 'firebase/auth';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private userService: UserService,private router: Router) { }

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        const user: User = userCredential.user
        console.log('Login succesfull', user);

        this.router.navigate(['/'])
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  }
}
