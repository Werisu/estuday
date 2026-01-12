import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente de layout base para a área do aluno.
 * Fornece a estrutura principal da aplicação com header e área de conteúdo.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
