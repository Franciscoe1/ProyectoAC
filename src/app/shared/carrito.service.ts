import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private contador = new BehaviorSubject<number>(0);
  contador$ = this.contador.asObservable();

  setCantidad(cantidad: number) {
    this.contador.next(cantidad);
  }

}