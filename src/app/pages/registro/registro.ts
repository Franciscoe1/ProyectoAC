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

  constructor(private http: HttpClient, private router: Router) {}

  registrar() {
    this.http.post<any>('http://127.0.0.1:8000/api/registro/', this.form)
      .subscribe({
        next: (data) => {

          // 🔥 GUARDAR USUARIO
          localStorage.setItem('usuario', JSON.stringify(data));

          localStorage.setItem('mensajeLogin', `Bienvenido ${data.nombre}!`);
          this.router.navigate(['/menu']);


          // 🔥 VOLVER AL CARRITO
          this.router.navigate(['/login']);
        },
        error: () => alert("❌ Usuario ya existe")
      });
  }
}