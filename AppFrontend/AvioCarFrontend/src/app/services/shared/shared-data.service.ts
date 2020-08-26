import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SharedDataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(public router: Router) { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}
