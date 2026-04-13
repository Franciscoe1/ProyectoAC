import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent implements OnInit {

  productos: any[] = [];
  categoriaActiva: string = 'donas';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any>(`http://127.0.0.1:8000/api/productos/?categoria=${this.categoriaActiva}`)
      .subscribe({
        next: (data) => {
          console.log("PRODUCTOS:", data);
          this.productos = data.productos;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR:", err);
        }
      });
  }

  
    animar: boolean = true;

  cambiarCategoria(cat: string) {
    this.categoriaActiva = cat;

    this.animar = false;

    setTimeout(() => {
      this.animar = true;
      this.cargarProductos();
    }, 50);
  }

}
