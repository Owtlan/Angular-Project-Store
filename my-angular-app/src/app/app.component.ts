import { Component, OnInit } from '@angular/core';
import { Auth, user as authUser } from '@angular/fire/auth';
import { Observable } from 'rxjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-angular-app';

  user$: Observable<any> | null = null 
  constructor(private auth: Auth) { }

  ngOnInit(): void {
    this.user$ = authUser(this.auth); 
    this.user$.subscribe(user => {
      console.log('User ', user);
    });
  }
}
