import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class OnlineStatusService {

  private onlineStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);
  onlineStatus$ = this.onlineStatusSubject.asObservable();

  constructor() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(status: boolean) {
    this.onlineStatusSubject.next(status);
  }
  
}
