import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  productos: any[] = [];

  imagenes = ['banner1.png', 'banner2.png', 'banner3.png'];
  indice = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/productos/')
      .subscribe({
        next: (data) => {
          console.log('DATA:', data);
          this.productos = data.productos;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
        }
      });

    setInterval(() => {
      this.siguiente();
    }, 5000);
  }

  siguiente() {
    this.indice = (this.indice + 1) % this.imagenes.length;
  }

  anterior() {
    this.indice = (this.indice - 1 + this.imagenes.length) % this.imagenes.length;
  }

  irAPedidos() {
    console.log('Ir a pedidos corporativos');
  }
}
