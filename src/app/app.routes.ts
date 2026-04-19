import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MenuComponent } from './pages/menu/menu';
import { CarritoComponent } from './pages/carrito/carrito';
import { PedidosComponent } from './pages/pedidos/pedidos';
import { RegistroComponent } from './pages/registro/registro';
import { LoginComponent } from './pages/login/login';
import { ContactoComponent } from './pages/contacto/contacto';
import { DesarrolladoresComponent } from './pages/desarrolladores/desarrolladores';
import { provideRouter, withRouterConfig } from '@angular/router';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'equipo', component: DesarrolladoresComponent },
  { path: '**', redirectTo: '' }
];