import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CarritoService } from '../../shared/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {

  items: any[] = [];
  carritoId: number | null = null;
  mostrarCheckout = false;
  form = {nombre: '',direccion: '',email: '',metodo: 'tarjeta'};

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private carritoService: CarritoService) {}

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

        this.items.forEach(item => {
          item.animar = true;
          setTimeout(() => item.animar = false, 200);
        });

        // 🔥 NUEVO → ACTUALIZA BADGE
        const total = this.items.reduce((sum, i) => sum + i.cantidad, 0);
        this.carritoService.setCantidad(total);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ ERROR cargando carrito:", err);
      }
    });
}

  sumar(item: any) {
  if (!this.carritoId) return;

  console.log("➕ SUMAR:", item);

  item.animar = true; // 🔥 activar animación

  this.http.post('http://127.0.0.1:8000/api/carrito/agregar/', {
    carrito_id: this.carritoId,
    producto_id: item.producto_id
  }).subscribe({
    next: () => {
      this.cargarCarrito();

      setTimeout(() => item.animar = false, 200); // 🔥 quitar animación
    },
    error: (err) => console.error("❌ ERROR sumar:", err)
  });
}

  restar(item: any) {
  if (!this.carritoId) return;

  console.log("➖ ITEM RESTAR:", item);

  item.animar = true; // 🔥 activar animación

  this.http.post('http://127.0.0.1:8000/api/carrito/eliminar/', {
    carrito_id: this.carritoId,
    producto_id: item.producto_id
  }).subscribe({
    next: () => {
      this.cargarCarrito();

      setTimeout(() => item.animar = false, 200); // 🔥 quitar animación
    },
    error: (err) => console.error("❌ ERROR restar:", err)
  });
}

  eliminar(item: any) {
  if (!this.carritoId) return;

  console.log("❌ ITEM ELIMINAR:", item);

  item.animar = true; // 🔥 animación antes de eliminar

  this.http.post('http://127.0.0.1:8000/api/carrito/eliminar/', {
    carrito_id: this.carritoId,
    producto_id: item.producto_id,
    eliminar_todo: true
  }).subscribe({
    next: () => this.cargarCarrito(),
    error: (err) => console.error("❌ ERROR eliminar:", err)
  });
}

confirmarCompra() {
  if (!this.form.nombre || !this.form.direccion || !this.form.email) {
    alert("⚠️ Completa todos los campos");
    return;
  }

  alert("✅ Compra realizada con éxito 🎉");

  // 🔥 1. limpiar items
  this.items = [];

  // 🔥 2. limpiar carrito guardado
  localStorage.removeItem('carrito');

  // 🔥 3. resetear contador GLOBAL (ESTA ES LA CLAVE)
  this.carritoService.setCantidad(0);

  // 🔥 4. ocultar checkout
  this.mostrarCheckout = false;

  // 🔥 opcional: refrescar UI
  this.cdr.detectChanges();
}


  get total() {
    return this.items.reduce((sum, i) => sum + i.cantidad, 0);
  }

  checkout() {
    this.mostrarCheckout = true;
  }
}