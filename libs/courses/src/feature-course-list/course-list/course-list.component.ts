import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Course } from '@estuday/shared';
import { CoursesService } from '../../data-access';
import { CourseCardComponent } from '../../ui';

/**
 * Componente de listagem de cursos.
 * Exibe todos os cursos disponíveis em formato de grid.
 */
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  private readonly coursesService = inject(CoursesService);

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
   * Signal com filtro de busca.
   */
  readonly searchFilter = signal<string>('');

  /**
   * Signal com filtro de nível.
   */
  readonly levelFilter = signal<
    'all' | 'beginner' | 'intermediate' | 'advanced'
  >('all');

  /**
   * Cursos filtrados (computed).
   */
  readonly filteredCourses = signal<Course[]>([]);

  ngOnInit(): void {
    // Carrega cursos ao inicializar
    this.loadCourses();

    // Atualiza cursos filtrados quando cursos ou filtros mudam
    this.updateFilteredCourses();
  }

  /**
   * Carrega a lista de cursos.
   */
  async loadCourses(): Promise<void> {
    try {
      await this.coursesService.loadCourses();
      this.updateFilteredCourses();
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  }

  /**
   * Atualiza o filtro de busca.
   *
   * @param search - Texto de busca
   */
  protected onSearchChange(search: string): void {
    this.searchFilter.set(search);
    this.updateFilteredCourses();
  }

  /**
   * Atualiza o filtro de nível.
   *
   * @param level - Nível selecionado
   */
  protected onLevelFilterChange(
    level: 'all' | 'beginner' | 'intermediate' | 'advanced',
  ): void {
    this.levelFilter.set(level);
    this.updateFilteredCourses();
  }

  /**
   * Atualiza a lista de cursos filtrados.
   */
  private updateFilteredCourses(): void {
    const allCourses = this.courses();
    const search = this.searchFilter().toLowerCase();
    const level = this.levelFilter();

    let filtered = allCourses;

    // Aplica filtro de busca
    if (search) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search),
      );
    }

    // Aplica filtro de nível
    if (level !== 'all') {
      filtered = filtered.filter((course) => course.level === level);
    }

    this.filteredCourses.set(filtered);
  }
}
