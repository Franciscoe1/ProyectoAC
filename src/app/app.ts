import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  productos: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // 👈 IMPORTANTE
  ) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/productos/')
      .subscribe({
        next: (data) => {
          console.log("DATA:", data);

          this.productos = data.productos;

          console.log("PRODUCTOS:", this.productos);

          this.cdr.detectChanges(); // 🔥 SOLUCIÓN
        },
        error: (err) => {
          console.error("ERROR:", err);
        }
      });
  }
}
