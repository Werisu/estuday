import { computed, Injectable, signal } from '@angular/core';
import { Course, CreateCourse, UpdateCourse } from '@estuday/shared';

/**
 * Estado de carregamento de cursos.
 */
interface CoursesState {
  /** Lista de cursos */
  courses: Course[];

  /** Curso selecionado/detalhado */
  selectedCourse: Course | null;

  /** Indica se está carregando */
  isLoading: boolean;

  /** Erro (se houver) */
  error: string | null;
}

/**
 * Serviço de gerenciamento de cursos usando Signals.
 * Atualmente mockado, preparado para integração com backend.
 */
@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  /**
   * Signal com o estado completo de cursos.
   */
  private readonly stateSignal = signal<CoursesState>({
    courses: [],
    selectedCourse: null,
    isLoading: false,
    error: null,
  });

  /**
   * Lista de cursos (computed).
   */
  readonly courses = computed(() => this.stateSignal().courses);

  /**
   * Curso selecionado (computed).
   */
  readonly selectedCourse = computed(() => this.stateSignal().selectedCourse);

  /**
   * Indica se está carregando (computed).
   */
  readonly isLoading = computed(() => this.stateSignal().isLoading);

  /**
   * Erro atual (computed).
   */
  readonly error = computed(() => this.stateSignal().error);

  /**
   * Estado completo (computed).
   */
  readonly state = computed(() => this.stateSignal());

  constructor() {
    // Carrega dados mockados na inicialização
    this.loadMockData();
  }

  /**
   * Carrega todos os cursos.
   * Em produção, faria uma chamada HTTP.
   */
  async loadCourses(): Promise<Course[]> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Simula delay de requisição
      await this.delay(500);

      const courses = this.getMockCourses();
      this.updateState({ courses, isLoading: false });

      return courses;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar cursos';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Busca um curso por ID.
   * Em produção, faria uma chamada HTTP.
   *
   * @param id - ID do curso
   * @returns Curso encontrado ou null
   */
  async getCourseById(id: string): Promise<Course | null> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Simula delay de requisição
      await this.delay(300);

      const course = this.getMockCourses().find((c) => c.id === id) || null;
      this.updateState({ selectedCourse: course, isLoading: false });

      return course;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao buscar curso';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Cria um novo curso.
   * Em produção, faria uma chamada HTTP POST.
   *
   * @param courseData - Dados do curso a ser criado
   * @returns Curso criado
   */
  async createCourse(courseData: CreateCourse): Promise<Course> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Simula delay de requisição
      await this.delay(500);

      const newCourse: Course = {
        ...courseData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const currentCourses = this.stateSignal().courses;
      this.updateState({
        courses: [...currentCourses, newCourse],
        isLoading: false,
      });

      return newCourse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar curso';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Atualiza um curso existente.
   * Em produção, faria uma chamada HTTP PUT/PATCH.
   *
   * @param id - ID do curso
   * @param courseData - Dados a serem atualizados
   * @returns Curso atualizado
   */
  async updateCourse(id: string, courseData: UpdateCourse): Promise<Course> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Simula delay de requisição
      await this.delay(500);

      const currentCourses = this.stateSignal().courses;
      const courseIndex = currentCourses.findIndex((c) => c.id === id);

      if (courseIndex === -1) {
        throw new Error('Curso não encontrado');
      }

      const updatedCourse: Course = {
        ...currentCourses[courseIndex],
        ...courseData,
        updatedAt: new Date(),
      };

      const updatedCourses = [...currentCourses];
      updatedCourses[courseIndex] = updatedCourse;

      this.updateState({
        courses: updatedCourses,
        selectedCourse:
          this.stateSignal().selectedCourse?.id === id
            ? updatedCourse
            : this.stateSignal().selectedCourse,
        isLoading: false,
      });

      return updatedCourse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao atualizar curso';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Remove um curso.
   * Em produção, faria uma chamada HTTP DELETE.
   *
   * @param id - ID do curso
   */
  async deleteCourse(id: string): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Simula delay de requisição
      await this.delay(300);

      const currentCourses = this.stateSignal().courses;
      const filteredCourses = currentCourses.filter((c) => c.id !== id);

      this.updateState({
        courses: filteredCourses,
        selectedCourse:
          this.stateSignal().selectedCourse?.id === id
            ? null
            : this.stateSignal().selectedCourse,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao remover curso';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Limpa o curso selecionado.
   */
  clearSelectedCourse(): void {
    this.updateState({ selectedCourse: null });
  }

  /**
   * Atualiza o estado de forma imutável.
   *
   * @param updates - Atualizações parciais do estado
   */
  private updateState(updates: Partial<CoursesState>): void {
    this.stateSignal.update((current) => ({ ...current, ...updates }));
  }

  /**
   * Carrega dados mockados na inicialização.
   */
  private loadMockData(): void {
    const mockCourses = this.getMockCourses();
    this.updateState({ courses: mockCourses });
  }

  /**
   * Retorna lista de cursos mockados.
   *
   * @returns Array de cursos mockados
   */
  private getMockCourses(): Course[] {
    return [
      {
        id: '1',
        title: 'Angular do Zero ao Avançado',
        description:
          'Aprenda Angular desde o básico até conceitos avançados, incluindo Signals, Standalone Components e muito mais.',
        coverImageUrl: 'https://via.placeholder.com/400x300?text=Angular',
        level: 'beginner',
        durationHours: 40,
        status: 'published',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'TypeScript Profissional',
        description:
          'Domine TypeScript com tipos avançados, generics, decorators e todas as funcionalidades modernas.',
        coverImageUrl: 'https://via.placeholder.com/400x300?text=TypeScript',
        level: 'intermediate',
        durationHours: 25,
        status: 'published',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '3',
        title: 'RxJS e Programação Reativa',
        description:
          'Entenda Observables, Operators, Subjects e como construir aplicações reativas com RxJS.',
        coverImageUrl: 'https://via.placeholder.com/400x300?text=RxJS',
        level: 'advanced',
        durationHours: 30,
        status: 'published',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
      },
    ];
  }

  /**
   * Gera um ID único (mockado).
   * Em produção, o backend geraria o ID.
   *
   * @returns ID gerado
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Delay para simular requisição HTTP.
   *
   * @param ms - Milissegundos de delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
