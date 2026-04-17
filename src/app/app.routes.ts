import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MenuComponent } from './pages/menu/menu';
import { CarritoComponent } from './pages/carrito/carrito';
import { PedidosComponent } from './pages/pedidos/pedidos';
import { provideRouter, withRouterConfig } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: '**', redirectTo: '' }
];