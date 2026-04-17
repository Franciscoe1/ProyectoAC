import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../carrito.service';
 import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class LayoutComponent implements OnInit {

  email: string = '';

  // 🔥 BADGE DEL CARRITO
  cantidad: number = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {

    // 🔥 ESCUCHA CAMBIOS DEL CARRITO (GLOBAL)
    this.carritoService.contador$.subscribe(c => {
      this.cantidad = c;

      // opcional pero ayuda a refrescar UI
      this.cdr.detectChanges();
    });

  }

  registrarEmail(event: Event) {
    event.preventDefault();

    if (!this.email) {
      alert('Ingresa un email válido');
      return;
    }

    this.http.post('http://localhost:8000/api/suscribirse/', {
      email: this.email
    }).subscribe({
      next: () => {
        alert('¡Registrado correctamente! 🎉');
        this.email = '';
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar el email');
      }
    });
  }
}