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

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://127.0.0.1:8000/api/login/', this.form)
      .subscribe({
        next: (data) => {

        localStorage.setItem('usuario', JSON.stringify(data));

           // 🔥 guardar mensaje temporal
        localStorage.setItem('mensajeLogin', `Bienvenido ${data.nombre}!`);
          this.router.navigate(['/menu']);

          // 🔥 FORZAR ACTUALIZACIÓN
        window.dispatchEvent(new Event('storage'));

        },
        error: () => alert("❌ Credenciales incorrectas")
      });
  }
}