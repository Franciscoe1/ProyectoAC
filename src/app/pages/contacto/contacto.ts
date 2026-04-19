import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent implements OnInit {

  form = {
    nombre: '',
    telefono: '',
    email: '',
    metodo: '',
    asunto: '',
    mensaje: ''
  };

  enviado: boolean = false;
  enviando: boolean = false; // 🔥 CLAVE
  mensaje: string = '';
  timeoutRef: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  this.enviado = false;
  this.resetFormulario();
}

  resetFormulario() {

    this.form = {
      nombre: '',
      telefono: '',
      email: '',
      metodo: '',
      asunto: '',
      mensaje: ''
    };
  }

  emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  mostrarMensaje(texto: string) {
    if (this.timeoutRef) clearTimeout(this.timeoutRef);

    this.mensaje = texto;

    this.timeoutRef = setTimeout(() => {
      this.mensaje = '';
    }, 2500);
  }

enviar() {

  if (this.enviando) return;

  // VALIDACIONES
  if (!this.form.nombre || !this.form.email || !this.form.mensaje) {
    this.mostrarMensaje('⚠️ Completa los campos obligatorios');
    return;
  }

  if (!this.emailValido(this.form.email)) {
    this.mostrarMensaje('⚠️ Email inválido');
    return;
  }

  if (this.form.telefono && !/^[0-9]+$/.test(this.form.telefono)) {
    this.mostrarMensaje('⚠️ El teléfono solo debe contener números');
    return;
  }

  // 🔥 CAMBIO INMEDIATO
  this.enviado = true;

  const dataEnviar = { ...this.form };

  // 🔥 limpiar solo datos
  this.resetFormulario();

  this.enviando = true;

  this.http.post<any>('http://127.0.0.1:8000/api/contacto/', dataEnviar)
    .subscribe({
      next: () => {
        this.enviando = false;
      },
      error: () => {
        this.enviando = false;
      }
    });
}

  soloNumeros(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.form.telefono = event.target.value;
  }
}