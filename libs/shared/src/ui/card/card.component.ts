import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Componente de card reutilizável.
 * Container para exibir conteúdo agrupado.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {}
