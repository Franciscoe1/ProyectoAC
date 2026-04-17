import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../carrito.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class LayoutComponent implements OnInit {

  // 📩 SUSCRIPCIÓN
  email: string = '';

  // 🛒 BADGE CARRITO
  cantidad: number = 0;

  // 👤 USUARIO
  usuario: any = null;

  // 🔔 TOAST
  mensaje: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {

    // 🔐 cargar usuario
    this.cargarUsuario();

    // 🔄 detectar login/logout entre pestañas
    window.addEventListener('storage', () => {
      this.cargarUsuario();
    });

    // 🛒 actualizar carrito
    this.carritoService.contador$.subscribe(c => {
      this.cantidad = c;
      this.cdr.detectChanges();
    });

    // 🔥 MOSTRAR MENSAJE AL CAMBIAR DE RUTA
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const mensaje = localStorage.getItem('mensajeLogin');

        if (mensaje) {
          this.mostrarMensaje(mensaje);
          localStorage.removeItem('mensajeLogin');
        }

      }
    });

  }

  // 🔐 LOGOUT
  logout() {
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.router.navigate(['/']);
  }

  // 🔐 CARGAR USUARIO
  cargarUsuario() {
    const user = localStorage.getItem('usuario');

    if (user) {
      this.usuario = JSON.parse(user);
    } else {
      this.usuario = null;
    }

    this.cdr.detectChanges();
  }

  // 🔔 TOAST MENSAJE
  mostrarMensaje(texto: string) {
    this.mensaje = texto;

    setTimeout(() => {
      this.mensaje = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  // 📩 REGISTRAR EMAIL
  registrarEmail(event: Event) {
    event.preventDefault();

    if (!this.email) {
      this.mostrarMensaje('⚠️ Ingresa un email válido');
      return;
    }

    this.http.post('http://localhost:8000/api/suscribirse/', {
      email: this.email
    }).subscribe({
      next: () => {
        this.mostrarMensaje('🎉 ¡Registrado correctamente!');
        this.email = '';
      },
      error: (err) => {
        console.error(err);
        this.mostrarMensaje('❌ Error al registrar el email');
      }
    });
  }

}