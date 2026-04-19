import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  form = {
    email: '',
    password: ''
  };

  mensaje: string = '';
  timeoutRef: any;
  bloqueado: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // 🔥 VALIDAR EMAIL
  emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // 🔔 TOAST
  mostrarMensaje(texto: string) {
    if (this.timeoutRef) clearTimeout(this.timeoutRef);

    this.mensaje = texto;

    this.timeoutRef = setTimeout(() => {
      this.mensaje = '';
    }, 2500);
  }

  login() {

  // 🔥 VALIDACIÓN FRONT
  if (!this.form.email || !this.form.password) {
    this.mostrarMensaje('⚠️ Todos los campos son obligatorios');
    return;
  }

  if (!this.emailValido(this.form.email)) {
    this.mostrarMensaje('⚠️ Email inválido');
    return;
  }

  if (!this.form.password.trim()) {
    this.mostrarMensaje('⚠️ Ingresa una contraseña');
    return;
  }

  this.http.post<any>('http://127.0.0.1:8000/api/login/', this.form)
    .subscribe({
      next: (data) => {

        localStorage.setItem('usuario', JSON.stringify(data));
        localStorage.setItem('mensajeLogin', `Bienvenido ${data.nombre}!`);

        this.router.navigate(['/menu']);
        window.dispatchEvent(new Event('storage'));
      },

      error: (err) => {
        console.error("❌ ERROR LOGIN:", err);

        // 🔥 MENSAJE DEL BACKEND
        const mensajeBackend = err?.error?.error || "Error al iniciar sesión";

        this.mostrarMensaje(`❌ ${mensajeBackend}`);
      }
    });
}

  irRegistro() {
    this.router.navigate(['/registro']);
  }
}