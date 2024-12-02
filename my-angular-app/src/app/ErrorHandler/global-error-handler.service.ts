// global-error-handler.service.ts
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private ngZone: NgZone, private router: Router) { }

  handleError(error: any): void {
    this.ngZone.run(() => {
      if (error instanceof HttpErrorResponse) {

        console.error('HTTP Error:', error.message);
        alert(`An HTTP error occurred: ${error.status} ${error.statusText}`);
      } else {

        console.error('An error occurred:', error);
        alert('An unexpected error occurred. Please try again later.');
        this.router.navigate(['/'])
      }
    });
  }
}


