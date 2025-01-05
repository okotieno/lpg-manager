import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  private scannedSource = new BehaviorSubject<any>([]);

  constructor() { }
  get scanned$(): Observable<any> {
    return this.scannedSource.asObservable();
  }
  set scanned$(item: any) {
    const scannedItems = this.scannedSource.value;
    scannedItems.push(item);
    this.scannedSource.next(scannedItems);
  }

  clear() {
    this.scannedSource.next([]);
  }
}
