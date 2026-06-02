import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {


private spinnerSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  setSpinner(value: boolean): void {
    this.spinnerSubject.next(value);
  }

  getSpinnerValue() {
    return this.spinnerSubject.asObservable();
  }
}
