import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // 🔥 IMPORTANTE
  ) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/pedidos/')
      .subscribe({
        next: (data) => {
          console.log("📦 PEDIDOS:", data);

          this.pedidos = data || [];

          // 🔥 ESTO SOLUCIONA TODO
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
  }

}