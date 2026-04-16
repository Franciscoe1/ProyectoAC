import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent implements OnInit {

  productos: any[] = [];
  categoriaActiva: string = 'donas';

  carritoId: number | null = null;
  itemsCarrito: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  this.route.queryParams.subscribe((params) => {
    this.categoriaActiva = params['categoria'] || 'donas';
    this.cargarProductos();
  });

  const guardado = localStorage.getItem('carrito');

  if (guardado) {
    this.carritoId = Number(guardado);
    this.cargarCarrito();
  }
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


  crearCarrito() {
  this.http.post<any>('http://127.0.0.1:8000/api/carrito/', {})
    .subscribe(data => {
      this.carritoId = data.carrito_id;
      if (this.carritoId !== null) {
        localStorage.setItem('carrito', this.carritoId.toString());
    }
  });
}

  agregarAlCarrito(producto: any) {

  if (!this.carritoId) {
    this.crearCarritoYAgregar(producto);
    return;
  }

  this.agregarDirecto(producto);
}

crearCarritoYAgregar(producto: any) {
  this.http.post<any>('http://127.0.0.1:8000/api/carrito/', {})
    .subscribe(data => {

      this.carritoId = data.carrito_id;

      localStorage.setItem('carrito', String(this.carritoId));

      this.agregarDirecto(producto);
    });
}

agregarDirecto(producto: any) {
  this.http.post('http://127.0.0.1:8000/api/carrito/agregar/', {
    carrito_id: this.carritoId,
    producto_id: producto.id
  }).subscribe(() => this.cargarCarrito());
}

agregarProducto(producto: any) {
  if (!this.carritoId) return;

  this.http.post('http://127.0.0.1:8000/api/carrito/agregar/', {
    carrito_id: this.carritoId,
    producto_id: producto.id
  }).subscribe({
    next: () => this.cargarCarrito(),
    error: (err) => console.error("Error agregando", err)
  });
}

  cargarCarrito() {
  if (!this.carritoId) return;

  this.http.get<any>(
    `http://127.0.0.1:8000/api/carrito/${this.carritoId}/`
  ).subscribe(data => {
    this.itemsCarrito = data.items || [];
  });
}


  irCarrito() {
  this.router.navigate(['/carrito']);
}

get total() {
  return this.itemsCarrito.reduce((sum, item) => sum + item.cantidad, 0);
}
}
