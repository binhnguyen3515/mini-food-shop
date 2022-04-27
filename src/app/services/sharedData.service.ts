import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private sharedMessage = new BehaviorSubject<any>('null');
  currentMessage = this.sharedMessage.asObservable();

  _sharedMessage(msg: any) {
    this.sharedMessage.next(msg);
  }
}
