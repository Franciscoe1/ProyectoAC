import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class LayoutComponent implements OnInit {
  email: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

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