import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService, ModulesService, CoursesService } from '../../data-access';
import { DataTableComponent, TableColumn } from '../../ui';
import { Lesson } from '@estuday/shared';

/**
 * Componente de administração de aulas de um módulo.
 * Lista, cria, edita e remove aulas.
 */
@Component({
  selector: 'app-lessons-admin',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './lessons-admin.component.html',
  styleUrl: './lessons-admin.component.scss',
})
export class LessonsAdminComponent implements OnInit {
  private readonly lessonsService = inject(LessonsService);
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o ID do curso.
   */
  readonly courseId = signal<string | null>(null);

  /**
   * Signal com o ID do módulo.
   */
  readonly moduleId = signal<string | null>(null);

  /**
   * Signal com a lista de aulas.
   */
  readonly lessons = signal<Lesson[]>([]);

  /**
   * Signal com o módulo atual.
   */
  readonly module = signal<any>(null);

  /**
   * Signal com o curso atual.
   */
  readonly course = this.coursesService.selectedCourse;

  /**
   * Signal indicando se está carregando.
   */
  readonly isLoading = this.lessonsService.isLoading;

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly error = this.lessonsService.error;

  /**
   * Colunas da tabela de aulas.
   */
  readonly columns: TableColumn[] = [
    { key: 'title', label: 'Título' },
    {
      key: 'contentType',
      label: 'Tipo',
      format: (v) => this.formatContentType(v),
    },
    { key: 'durationMinutes', label: 'Duração (min)' },
    { key: 'order', label: 'Ordem' },
    {
      key: 'isFree',
      label: 'Gratuito',
      format: (v) => (v ? 'Sim' : 'Não'),
    },
    { key: 'status', label: 'Status', format: (v) => this.formatStatus(v) },
  ];

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const moduleId = this.route.snapshot.paramMap.get('moduleId');

    if (courseId && moduleId) {
      this.courseId.set(courseId);
      this.moduleId.set(moduleId);
      this.loadData(courseId, moduleId);
    } else {
      this.router.navigate(['/admin/courses']);
    }
  }

  /**
   * Carrega curso, módulo e aulas.
   *
   * @param courseId - ID do curso
   * @param moduleId - ID do módulo
   */
  async loadData(courseId: string, moduleId: string): Promise<void> {
    try {
      await this.coursesService.getCourseById(courseId);
      await this.modulesService.loadModulesByCourse(courseId);
      await this.modulesService.loadLessonsByModule(moduleId);

      // Obtém módulo e aulas
      const modules = this.modulesService.modules();
      const module = modules.find((m) => m.id === moduleId);
      this.module.set(module);

      const lessons = this.modulesService.getLessonsByModule(moduleId);
      this.lessons.set(lessons);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  /**
   * Navega para criação de nova aula.
   */
  protected createLesson(): void {
    const courseId = this.courseId();
    const moduleId = this.moduleId();
    if (courseId && moduleId) {
      this.router.navigate([
        '/admin/courses',
        courseId,
        'modules',
        moduleId,
        'lessons',
        'new',
      ]);
    }
  }

  /**
   * Navega para edição de aula.
   *
   * @param lesson - Aula a ser editada
   */
  protected editLesson(lesson: Lesson): void {
    const courseId = this.courseId();
    const moduleId = this.moduleId();
    if (courseId && moduleId) {
      this.router.navigate([
        '/admin/courses',
        courseId,
        'modules',
        moduleId,
        'lessons',
        lesson.id,
        'edit',
      ]);
    }
  }

  /**
   * Remove uma aula.
   *
   * @param lesson - Aula a ser removida
   */
  protected async deleteLesson(lesson: Lesson): Promise<void> {
    try {
      await this.lessonsService.deleteLesson(lesson.id);
      const courseId = this.courseId();
      const moduleId = this.moduleId();
      if (courseId && moduleId) {
        await this.loadData(courseId, moduleId);
      }
    } catch (error) {
      console.error('Erro ao remover aula:', error);
    }
  }

  /**
   * Volta para a lista de módulos.
   */
  protected goBack(): void {
    const courseId = this.courseId();
    if (courseId) {
      this.router.navigate(['/admin/courses', courseId, 'modules']);
    }
  }

  /**
   * Formata o tipo de conteúdo.
   *
   * @param contentType - Tipo de conteúdo
   * @returns Texto formatado
   */
  private formatContentType(contentType: string): string {
    switch (contentType) {
      case 'video':
        return 'Vídeo';
      case 'text':
        return 'Texto';
      case 'quiz':
        return 'Quiz';
      case 'exercise':
        return 'Exercício';
      case 'document':
        return 'Documento';
      default:
        return contentType;
    }
  }

  /**
   * Formata o status da aula.
   *
   * @param status - Status da aula
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
