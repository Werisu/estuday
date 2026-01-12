import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoursesService } from '../../data-access';
import { DataTableComponent, TableColumn } from '../../ui';
import { Course, CreateCourse } from '@estuday/shared';

/**
 * Componente de administração de cursos.
 * Lista, cria, edita e remove cursos.
 */
@Component({
  selector: 'app-courses-admin',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './courses-admin.component.html',
  styleUrl: './courses-admin.component.scss',
})
export class CoursesAdminComponent implements OnInit {
  private readonly coursesService = inject(CoursesService);
  private readonly router = inject(Router);

  /**
   * Signal com a lista de cursos.
   */
  readonly courses = this.coursesService.courses;

  /**
   * Signal indicando se está carregando.
   */
  readonly isLoading = this.coursesService.isLoading;

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly error = this.coursesService.error;

  /**
   * Colunas da tabela de cursos.
   */
  readonly columns: TableColumn[] = [
    { key: 'title', label: 'Título' },
    { key: 'level', label: 'Nível', format: (v) => this.formatLevel(v) },
    { key: 'durationHours', label: 'Duração (h)' },
    { key: 'status', label: 'Status', format: (v) => this.formatStatus(v) },
    {
      key: 'createdAt',
      label: 'Criado em',
      format: (v) => new Date(v).toLocaleDateString('pt-BR'),
    },
  ];

  /**
   * Signal indicando se está mostrando formulário de criação.
   */
  readonly showCreateForm = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCourses();
  }

  /**
   * Carrega a lista de cursos.
   */
  async loadCourses(): Promise<void> {
    try {
      await this.coursesService.loadCourses();
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  }

  /**
   * Navega para criação de novo curso.
   */
  protected createCourse(): void {
    this.router.navigate(['/admin/courses/new']);
  }

  /**
   * Navega para edição de curso ou módulos.
   *
   * @param course - Curso a ser editado
   */
  protected editCourse(course: Course): void {
    // Navega para módulos do curso (onde pode editar o curso também)
    this.router.navigate(['/admin/courses', course.id, 'modules']);
  }

  /**
   * Remove um curso.
   *
   * @param course - Curso a ser removido
   */
  protected async deleteCourse(course: Course): Promise<void> {
    try {
      await this.coursesService.deleteCourse(course.id);
      await this.loadCourses();
    } catch (error) {
      console.error('Erro ao remover curso:', error);
    }
  }

  /**
   * Formata o nível do curso.
   *
   * @param level - Nível do curso
   * @returns Texto formatado
   */
  private formatLevel(level: string): string {
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
   * Formata o status do curso.
   *
   * @param status - Status do curso
   * @returns Texto formatado
   */
  private formatStatus(status: string): string {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'published':
        return 'Publicado';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  }
}
