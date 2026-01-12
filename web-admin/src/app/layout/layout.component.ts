import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente de layout base para o painel administrativo.
 * Fornece a estrutura principal da aplicação com header, sidebar e área de conteúdo.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
