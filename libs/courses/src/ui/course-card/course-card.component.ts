import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Course } from '@estuday/shared';

/**
 * Componente de card de curso reutilizável.
 * Exibe informações resumidas de um curso.
 */
@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  /** Curso a ser exibido */
  readonly course = input.required<Course>();

  /** Rota para detalhes do curso (opcional) */
  readonly detailRoute = input<string | null>(null);

  /**
   * Obtém a rota de detalhes do curso.
   */
  protected getDetailRoute(): string {
    const route = this.detailRoute();
    if (route) return route;
    return `/courses/${this.course().id}`;
  }

  /**
   * Obtém a cor do badge baseado no nível do curso.
   */
  protected getLevelBadgeClass(level: string): string {
    switch (level) {
      case 'beginner':
        return 'badge-beginner';
      case 'intermediate':
        return 'badge-intermediate';
      case 'advanced':
        return 'badge-advanced';
      default:
        return '';
    }
  }

  /**
   * Obtém o texto do nível em português.
   */
  protected getLevelText(level: string): string {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return level;
    }
  }
}
