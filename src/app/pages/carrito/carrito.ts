  import { Component, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { CommonModule } from '@angular/common';
  import { ChangeDetectorRef } from '@angular/core';
  import { CarritoService } from '../../shared/carrito.service';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';

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
    compraExitosa = false;
     mensaje: string = '';

    constructor(
      private http: HttpClient, 
      private cdr: ChangeDetectorRef, 
      private carritoService: CarritoService, 
      private router: Router) {}

    ngOnInit() {
      console.log("🧠 localStorage:", localStorage.getItem('carrito'));
      this.cargarCarrito();
    }

      // 🔥 FUNCIÓN TOAST
    mostrarMensaje(texto: string) {
      this.mensaje = texto;

    setTimeout(() => {
      this.mensaje = '';
    }, 2500);
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

    // 🔥 VALIDAR USUARIO
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
      localStorage.setItem('mensajeLogin', '⚠️ Debes registrarte primero');
      this.router.navigate(['/registro']);
      return;
    }

    if (!this.form.nombre || !this.form.direccion || !this.form.email) {
      this.mostrarMensaje('⚠️ Completa todos los campos');
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/pedido/', {
      nombre: this.form.nombre,
      direccion: this.form.direccion,
      email: this.form.email,
      items: this.items
    }).subscribe({
      next: () => {

        this.compraExitosa = true;

        this.items = [];

        localStorage.removeItem('carrito');

        this.carritoService.setCantidad(0);

        this.mostrarCheckout = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ ERROR compra:", err);
        const mensaje = err?.error?.error || "Error al procesar la compra";

  this.mostrarMensaje(mensaje); // si usas toast
}
    });
  }

  cerrarCompra() {
    this.compraExitosa = false;
    window.location.href = '/menu';
  }

    get total() {
      return this.items.reduce((sum, i) => sum + i.cantidad, 0);
    }

    checkout() {
      this.mostrarCheckout = true;
    }
  }