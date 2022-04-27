import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private sharedData = new BehaviorSubject<string>('Bạn');
  currentData = this.sharedData.asObservable();
  constructor() {}
  changeData(data: string) {
    this.sharedData.next(data);
  }

  get currentValue() {return this.sharedData.value}
}
