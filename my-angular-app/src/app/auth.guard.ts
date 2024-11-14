import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private auth: Auth, private router: Router) { }

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.router.navigate(['/']);
          observer.next(false); 
        } else {
          observer.next(true);
        }
        observer.complete();
      });
    });
  }
}

