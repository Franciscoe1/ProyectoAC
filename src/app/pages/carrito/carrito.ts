import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {

  items: any[] = [];
  carritoId: number | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log("🧠 localStorage:", localStorage.getItem('carrito'));
    this.cargarCarrito();
  }

  cargarCarrito() {
    const guardado = localStorage.getItem('carrito');

    if (!guardado) {
      console.error("❌ No hay carrito en localStorage");
      return;
    }

    this.carritoId = Number(guardado);

    console.log("🛒 Cargando carrito:", this.carritoId);

    this.http.get<any>(`http://127.0.0.1:8000/api/carrito/${this.carritoId}/`)
  .subscribe({
    next: (data) => {
      console.log("✅ DATA CARRITO:", data);

      this.items = data.items || [];

      this.cdr.detectChanges(); // 🔥 ESTO ES LA CLAVE
    },
    error: (err) => {
      console.error("❌ ERROR cargando carrito:", err);
    }
  });
  }
  
  sumar(item: any) {
    if (!this.carritoId) return;

    console.log("➕ SUMAR:", item);

    this.http.post('http://127.0.0.1:8000/api/carrito/agregar/', {
      carrito_id: this.carritoId,
      producto_id: item.producto_id
    }).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => console.error("❌ ERROR sumar:", err)
    });
  }

  restar(item: any) {
    if (!this.carritoId) return;

    console.log("➖ ITEM RESTAR:", item);

    this.http.post('http://127.0.0.1:8000/api/carrito/eliminar/', {
      carrito_id: this.carritoId,
      producto_id: item.producto_id
    }).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => console.error("❌ ERROR restar:", err)
    });
  }

  eliminar(item: any) {
    if (!this.carritoId) return;

    console.log("❌ ITEM ELIMINAR:", item);

    this.http.post('http://127.0.0.1:8000/api/carrito/eliminar/', {
      carrito_id: this.carritoId,
      producto_id: item.producto_id,
      eliminar_todo: true
    }).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => console.error("❌ ERROR eliminar:", err)
    });
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.cantidad, 0);
  }
}