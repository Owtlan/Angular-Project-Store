import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private welcomeMessageSource = new BehaviorSubject<string>('');
  welcomeMessage$ = this.welcomeMessageSource.asObservable();

  setMessage(message: string) {
    this.welcomeMessageSource.next(message);
  }

  clearMessage() {
    this.welcomeMessageSource.next('');
  }
}