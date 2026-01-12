import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from '@estuday/shared';
import {
  CoursesService,
  LessonProgressService,
  ModulesService,
} from '../../data-access';

/**
 * Componente de detalhe do curso.
 * Exibe informações completas de um curso específico com módulos e aulas.
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
  private readonly modulesService = inject(ModulesService);
  private readonly progressService = inject(LessonProgressService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o curso selecionado.
   */
  readonly course = this.coursesService.selectedCourse;

  /**
   * Signal indicando se está carregando curso.
   */
  readonly isLoadingCourse = this.coursesService.isLoading;

  /**
   * Signal indicando se está carregando módulos/aulas.
   */
  readonly isLoadingModules = this.modulesService.isLoading;

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly error = this.coursesService.error;

  /**
   * Signal com lista de módulos.
   */
  readonly modules = this.modulesService.modules;

  /**
   * Signal com lista de aulas.
   */
  readonly lessons = this.modulesService.lessons;

  /**
   * Módulos expandidos (mostrando aulas).
   */
  readonly expandedModules = signal<Set<string>>(new Set());

  /**
   * Verifica se um módulo está expandido.
   *
   * @param moduleId - ID do módulo
   * @returns true se o módulo está expandido
   */
  protected isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules().has(moduleId);
  }

  /**
   * Alterna a expansão de um módulo.
   *
   * @param moduleId - ID do módulo
   */
  protected toggleModule(moduleId: string): void {
    const expanded = new Set(this.expandedModules());
    if (expanded.has(moduleId)) {
      expanded.delete(moduleId);
    } else {
      expanded.add(moduleId);
      // Carrega aulas do módulo se ainda não foram carregadas
      this.loadModuleLessons(moduleId);
    }
    this.expandedModules.set(expanded);
  }

  /**
   * Obtém aulas de um módulo específico.
   *
   * @param moduleId - ID do módulo
   * @returns Lista de aulas do módulo
   */
  protected getModuleLessons(moduleId: string): Lesson[] {
    return this.modulesService.getLessonsByModule(moduleId);
  }

  /**
   * Verifica se uma aula está concluída.
   *
   * @param lessonId - ID da aula
   * @returns true se a aula está concluída
   */
  protected isLessonCompleted(lessonId: string): boolean {
    return this.progressService.isLessonCompleted(lessonId);
  }

  /**
   * Marca uma aula como concluída.
   *
   * @param lessonId - ID da aula
   */
  protected async completeLesson(lessonId: string): Promise<void> {
    try {
      await this.progressService.completeLesson(lessonId);
      // O progresso é calculado automaticamente via computed signals
      // Não é necessário chamar loadCourseProgress pois o cálculo é reativo
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error);
    }
  }

  /**
   * Calcula o progresso do curso baseado nas aulas concluídas.
   *
   * @returns Percentual de conclusão (0-100)
   */
  protected getCourseProgress(): number {
    const allLessons = this.lessons();
    if (allLessons.length === 0) return 0;

    const completedLessons = allLessons.filter((lesson) =>
      this.isLessonCompleted(lesson.id),
    );

    return Math.round((completedLessons.length / allLessons.length) * 100);
  }

  /**
   * Obtém o número de aulas concluídas.
   *
   * @returns Número de aulas concluídas
   */
  protected getCompletedLessonsCount(): number {
    return this.lessons().filter((lesson) => this.isLessonCompleted(lesson.id))
      .length;
  }

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
   * Carrega os detalhes do curso, módulos e aulas.
   *
   * @param id - ID do curso
   */
  async loadCourse(id: string): Promise<void> {
    try {
      await this.coursesService.getCourseById(id);
      await this.modulesService.loadModulesByCourse(id);
      await this.modulesService.loadLessonsByCourse(id);
      // Progresso é calculado automaticamente baseado nas aulas concluídas
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    }
  }

  /**
   * Carrega aulas de um módulo específico.
   *
   * @param moduleId - ID do módulo
   */
  private async loadModuleLessons(moduleId: string): Promise<void> {
    const existingLessons = this.getModuleLessons(moduleId);
    if (existingLessons.length === 0) {
      try {
        await this.modulesService.loadLessonsByModule(moduleId);
      } catch (error) {
        console.error('Erro ao carregar aulas do módulo:', error);
      }
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
