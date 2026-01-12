import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../data-access';

/**
 * Componente de detalhe do curso.
 * Exibe informações completas de um curso específico.
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit {
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o curso selecionado.
   */
  readonly course = this.coursesService.selectedCourse;

  /**
   * Signal indicando se está carregando.
   */
  readonly isLoading = this.coursesService.isLoading;

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly error = this.coursesService.error;

  ngOnInit(): void {
    // Obtém o ID do curso da rota
    const courseId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.loadCourse(courseId);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  /**
   * Carrega os detalhes do curso.
   *
   * @param id - ID do curso
   */
  async loadCourse(id: string): Promise<void> {
    try {
      await this.coursesService.getCourseById(id);
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    }
  }

  /**
   * Obtém o texto do nível em português.
   *
   * @param level - Nível do curso
   * @returns Texto do nível
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

  /**
   * Obtém a classe CSS do badge baseado no nível.
   *
   * @param level - Nível do curso
   * @returns Classe CSS
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
   * Volta para a lista de cursos.
   */
  protected goBack(): void {
    this.coursesService.clearSelectedCourse();
    this.router.navigate(['/courses']);
  }
}
