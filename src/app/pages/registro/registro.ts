import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  form = {
    nombre: '',
    email: '',
    password: ''
  };
  
  mensaje: string = '';
  timeoutRef: any; // 🔥 control del tiempo

  emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


}
  constructor(private http: HttpClient, private router: Router) {}

  // 🔥 FUNCIÓN GLOBAL DE MENSAJES
  mostrarMensaje(texto: string) {

    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }

    this.mensaje = texto;

    this.timeoutRef = setTimeout(() => {
      this.mensaje = '';
    }, 2500);
  }

  registrar() {

    // 🔥 VALIDACIÓN FRONT
    if (!this.form.nombre || !this.form.email || !this.form.password) {
  this.mostrarMensaje('⚠️ Todos los campos son obligatorios');
  return;
}

    if (!this.emailValido(this.form.email)) {
      this.mostrarMensaje('⚠️ Email inválido');
      return;
    }

    if (this.form.password.length < 4) {
      this.mostrarMensaje('⚠️ La contraseña debe tener al menos 4 caracteres');
      return;
  }

    this.http.post<any>('http://127.0.0.1:8000/api/registro/', this.form)
      .subscribe({
        next: (data) => {

          localStorage.setItem('usuario', JSON.stringify(data));
          localStorage.setItem('mensajeLogin', `Tu usuario a sido registrado con éxito ${data.nombre}!`);
          this.router.navigate(['/login']);
        },

        error: (err) => {
          console.error("❌ ERROR REGISTRO:", err);

          // 🔥 MENSAJE VIENE DEL BACKEND
          const mensajeBackend = err?.error?.error || "Error al registrarse";

          this.mostrarMensaje(`❌ ${mensajeBackend}`);
        }
      });
  }
}

