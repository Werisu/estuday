import { Component } from '@angular/core';

/**
 * Componente Home da área do aluno.
 * Página inicial com informações e acesso rápido às funcionalidades.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly title = 'Bem-vindo ao EstuDay';
}
