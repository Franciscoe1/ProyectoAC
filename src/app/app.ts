import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  productos: any[] = [];

  // 🔥 SLIDER
  imagenes = [
    'banner1.png',
    'banner2.png',
    'banner3.png'
  ];
  indice = 0;

  // 🔥 EMAIL FORM
  email: string = "";

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/productos/')
      .subscribe({
        next: (data) => {
          console.log("DATA:", data);

          this.productos = data.productos;

          console.log("PRODUCTOS:", this.productos);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR:", err);
        }
      });

    // 🔥 AUTO SLIDER
    setInterval(() => {
      this.siguiente();
    }, 5000);
  }

  // 🔥 SLIDER
  siguiente() {
    this.indice = (this.indice + 1) % this.imagenes.length;
  }

  anterior() {
    this.indice =
      (this.indice - 1 + this.imagenes.length) % this.imagenes.length;
  }

  // 🔥 BOTÓN PEDIDOS
  irAPedidos() {
    console.log("Ir a pedidos corporativos");
  }

  // 🔥 FORMULARIO DJANGO
  registrarEmail(event: Event) {
    event.preventDefault();

    if (!this.email) {
      alert("Ingresa un email válido");
      return;
    }

    this.http.post('http://localhost:8000/api/suscribirse/', {
      email: this.email
    }).subscribe({
      next: () => {
        alert("¡Registrado correctamente! 🎉");
        this.email = "";
      },
      error: (err) => {
        console.error(err);
        alert("Error al registrar el email");
      }
    });
  }
}