import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente Home da área do aluno.
 * Página inicial com informações e acesso rápido às funcionalidades.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly title = 'Bem-vindo ao EstuDay';
}
