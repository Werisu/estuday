import { computed, Injectable, signal } from '@angular/core';
import { Lesson, Module } from '@estuday/shared';

/**
 * Estado de módulos e aulas.
 */
interface ModulesState {
  /** Módulos do curso atual */
  modules: Module[];

  /** Aulas do curso atual */
  lessons: Lesson[];

  /** Indica se está carregando */
  isLoading: boolean;

  /** Erro (se houver) */
  error: string | null;
}

/**
 * Serviço de gerenciamento de módulos e aulas usando Signals.
 * Atualmente mockado, preparado para integração com backend.
 */
@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  /**
   * Signal com o estado completo de módulos e aulas.
   */
  private readonly stateSignal = signal<ModulesState>({
    modules: [],
    lessons: [],
    isLoading: false,
    error: null,
  });

  /**
   * Lista de módulos (computed).
   */
  readonly modules = computed(() => this.stateSignal().modules);

  /**
   * Lista de aulas (computed).
   */
  readonly lessons = computed(() => this.stateSignal().lessons);

  /**
   * Indica se está carregando (computed).
   */
  readonly isLoading = computed(() => this.stateSignal().isLoading);

  /**
   * Erro atual (computed).
   */
  readonly error = computed(() => this.stateSignal().error);

  /**
   * Carrega módulos de um curso.
   * Em produção, faria uma chamada HTTP.
   *
   * @param courseId - ID do curso
   * @returns Promise com lista de módulos
   */
  async loadModulesByCourse(courseId: string): Promise<Module[]> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(300);

      const modules = this.getMockModules(courseId);
      this.updateState({ modules, isLoading: false });

      return modules;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar módulos';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Carrega aulas de um módulo.
   * Em produção, faria uma chamada HTTP.
   *
   * @param moduleId - ID do módulo
   * @returns Promise com lista de aulas
   */
  async loadLessonsByModule(moduleId: string): Promise<Lesson[]> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(300);

      const lessons = this.getMockLessons(moduleId);
      const currentLessons = this.stateSignal().lessons;
      const updatedLessons = [
        ...currentLessons.filter((l) => l.moduleId !== moduleId),
        ...lessons,
      ];

      this.updateState({ lessons: updatedLessons, isLoading: false });

      return lessons;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar aulas';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Carrega todas as aulas de um curso.
   * Em produção, faria uma chamada HTTP.
   *
   * @param courseId - ID do curso
   * @returns Promise com lista de aulas
   */
  async loadLessonsByCourse(courseId: string): Promise<Lesson[]> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(500);

      const modules = this.getMockModules(courseId);
      const allLessons: Lesson[] = [];

      for (const module of modules) {
        const lessons = this.getMockLessons(module.id);
        allLessons.push(...lessons);
      }

      this.updateState({ lessons: allLessons, isLoading: false });

      return allLessons;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar aulas';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Obtém aulas de um módulo específico.
   *
   * @param moduleId - ID do módulo
   * @returns Lista de aulas do módulo
   */
  getLessonsByModule(moduleId: string): Lesson[] {
    return this.lessons().filter((lesson) => lesson.moduleId === moduleId);
  }

  /**
   * Limpa o estado de módulos e aulas.
   */
  clear(): void {
    this.updateState({ modules: [], lessons: [] });
  }

  /**
   * Atualiza o estado de forma imutável.
   *
   * @param updates - Atualizações parciais do estado
   */
  private updateState(updates: Partial<ModulesState>): void {
    this.stateSignal.update((current) => ({ ...current, ...updates }));
  }

  /**
   * Retorna módulos mockados para um curso.
   *
   * @param courseId - ID do curso
   * @returns Array de módulos mockados
   */
  private getMockModules(courseId: string): Module[] {
    const modules: Module[] = [];

    if (courseId === '1') {
      modules.push(
        {
          id: 'm1',
          courseId: '1',
          title: 'Introdução ao Angular',
          description: 'Conceitos fundamentais do Angular',
          order: 1,
          durationMinutes: 120,
          status: 'published',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-05'),
        },
        {
          id: 'm2',
          courseId: '1',
          title: 'Componentes e Templates',
          description: 'Aprendendo a criar componentes',
          order: 2,
          durationMinutes: 180,
          status: 'published',
          createdAt: new Date('2024-01-06'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: 'm3',
          courseId: '1',
          title: 'Serviços e Injeção de Dependência',
          description: 'Gerenciamento de estado e serviços',
          order: 3,
          durationMinutes: 150,
          status: 'published',
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-15'),
        },
      );
    }

    return modules;
  }

  /**
   * Retorna aulas mockadas para um módulo.
   *
   * @param moduleId - ID do módulo
   * @returns Array de aulas mockadas
   */
  private getMockLessons(moduleId: string): Lesson[] {
    const lessons: Lesson[] = [];

    if (moduleId === 'm1') {
      lessons.push(
        {
          id: 'l1',
          moduleId: 'm1',
          title: 'O que é Angular?',
          description: 'Introdução ao framework Angular',
          contentType: 'video',
          contentUrl: 'https://example.com/video1.mp4',
          durationMinutes: 20,
          order: 1,
          isFree: true,
          status: 'published',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 'l2',
          moduleId: 'm1',
          title: 'Configurando o Ambiente',
          description: 'Instalação e configuração inicial',
          contentType: 'text',
          textContent: 'Conteúdo da aula...',
          durationMinutes: 15,
          order: 2,
          isFree: true,
          status: 'published',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-03'),
        },
      );
    } else if (moduleId === 'm2') {
      lessons.push(
        {
          id: 'l3',
          moduleId: 'm2',
          title: 'Criando seu Primeiro Componente',
          description: 'Hands-on de criação de componentes',
          contentType: 'video',
          contentUrl: 'https://example.com/video2.mp4',
          durationMinutes: 30,
          order: 1,
          isFree: false,
          status: 'published',
          createdAt: new Date('2024-01-06'),
          updatedAt: new Date('2024-01-07'),
        },
        {
          id: 'l4',
          moduleId: 'm2',
          title: 'Templates e Data Binding',
          description: 'Interpolação, property binding e event binding',
          contentType: 'video',
          contentUrl: 'https://example.com/video3.mp4',
          durationMinutes: 25,
          order: 2,
          isFree: false,
          status: 'published',
          createdAt: new Date('2024-01-07'),
          updatedAt: new Date('2024-01-08'),
        },
      );
    } else if (moduleId === 'm3') {
      lessons.push({
        id: 'l5',
        moduleId: 'm3',
        title: 'Criando Serviços',
        description: 'Como criar e usar serviços no Angular',
        contentType: 'video',
        contentUrl: 'https://example.com/video4.mp4',
        durationMinutes: 35,
        order: 1,
        isFree: false,
        status: 'published',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-12'),
      });
    }

    return lessons;
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
