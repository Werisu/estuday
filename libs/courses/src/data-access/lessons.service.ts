import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateLesson, Lesson, UpdateLesson } from '@estuday/shared';
import { ModulesService } from './modules.service';

/**
 * Estado de aulas.
 */
interface LessonsState {
  /** Aulas do sistema */
  lessons: Lesson[];

  /** Indica se está carregando */
  isLoading: boolean;

  /** Erro (se houver) */
  error: string | null;
}

/**
 * Serviço de gerenciamento de aulas usando Signals.
 * Atualmente mockado, preparado para integração com backend.
 */
@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  private readonly modulesService = inject(ModulesService);

  /**
   * Signal com o estado completo de aulas.
   */
  private readonly stateSignal = signal<LessonsState>({
    lessons: [],
    isLoading: false,
    error: null,
  });

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
   * Cria uma nova aula.
   * Em produção, faria uma chamada HTTP POST.
   *
   * @param lessonData - Dados da aula a ser criada
   * @returns Promise com aula criada
   */
  async createLesson(lessonData: CreateLesson): Promise<Lesson> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(500);

      const newLesson: Lesson = {
        ...lessonData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const currentLessons = this.stateSignal().lessons;
      const updatedLessons = [...currentLessons, newLesson];

      this.updateState({
        lessons: updatedLessons,
        isLoading: false,
      });

      // Sincroniza com ModulesService
      this.modulesService.updateState({ lessons: updatedLessons });

      return newLesson;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar aula';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Atualiza uma aula existente.
   * Em produção, faria uma chamada HTTP PUT/PATCH.
   *
   * @param id - ID da aula
   * @param lessonData - Dados a serem atualizados
   * @returns Promise com aula atualizada
   */
  async updateLesson(
    id: string,
    lessonData: UpdateLesson
  ): Promise<Lesson> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(500);

      const currentLessons = this.stateSignal().lessons;
      const lessonIndex = currentLessons.findIndex((l) => l.id === id);

      if (lessonIndex === -1) {
        throw new Error('Aula não encontrada');
      }

      const updatedLesson: Lesson = {
        ...currentLessons[lessonIndex],
        ...lessonData,
        updatedAt: new Date(),
      };

      const updatedLessons = [...currentLessons];
      updatedLessons[lessonIndex] = updatedLesson;

      this.updateState({ lessons: updatedLessons, isLoading: false });

      // Sincroniza com ModulesService
      this.modulesService.updateState({ lessons: updatedLessons });

      return updatedLesson;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao atualizar aula';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Remove uma aula.
   * Em produção, faria uma chamada HTTP DELETE.
   *
   * @param id - ID da aula
   */
  async deleteLesson(id: string): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(300);

      const currentLessons = this.stateSignal().lessons;
      const filteredLessons = currentLessons.filter((l) => l.id !== id);

      this.updateState({ lessons: filteredLessons, isLoading: false });

      // Sincroniza com ModulesService
      this.modulesService.updateState({ lessons: filteredLessons });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao remover aula';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Busca uma aula por ID.
   *
   * @param id - ID da aula
   * @returns Aula encontrada ou null
   */
  getLessonById(id: string): Lesson | null {
    return this.lessons().find((l) => l.id === id) || null;
  }

  /**
   * Obtém aulas de um módulo específico.
   *
   * @param moduleId - ID do módulo
   * @returns Lista de aulas do módulo
   */
  getLessonsByModule(moduleId: string): Lesson[] {
    return this.lessons()
      .filter((l) => l.moduleId === moduleId)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Atualiza o estado de forma imutável.
   *
   * @param updates - Atualizações parciais do estado
   */
  private updateState(updates: Partial<LessonsState>): void {
    this.stateSignal.update((current) => ({ ...current, ...updates }));
  }

  /**
   * Gera um ID único (mockado).
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
