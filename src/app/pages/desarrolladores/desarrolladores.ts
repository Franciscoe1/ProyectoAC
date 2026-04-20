import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desarrolladores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desarrolladores.html',
  styleUrl: './desarrolladores.css'
})
export class DesarrolladoresComponent {

  desarrolladores = [
    {
      nombre: 'Alysson Guamán',
      rol: 'Frontend Developer',
      descripcion: 'Encargado de la interfaz, diseño y experiencia de usuario.',
      imagen: 'assets/videos/alysson.jpeg'
    },
    {
      nombre: 'Francisco Escobar',
      rol: 'Backend Developer',
      descripcion: 'Desarrolló la API, base de datos y lógica del sistema.',
      imagen: 'assets/videos/yo.jpg'
    },
    {
      nombre: 'Ronald Collaguazo',
      rol: 'Full Stack Developer',
      descripcion: 'Integración completa entre frontend y backend.',
      imagen: 'assets/videos/ronald.jpeg'
    }
  ];

}