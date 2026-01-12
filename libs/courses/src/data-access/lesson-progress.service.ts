import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@estuday/auth';
import {
  CourseProgress,
  LessonProgress,
  ModuleProgress,
} from '@estuday/shared';

/**
 * Estado de progresso de aulas.
 */
interface ProgressState {
  /** Progresso de aulas individuais */
  lessonProgresses: LessonProgress[];

  /** Progresso de cursos */
  courseProgresses: CourseProgress[];

  /** Progresso de módulos */
  moduleProgresses: ModuleProgress[];

  /** Indica se está carregando */
  isLoading: boolean;

  /** Erro (se houver) */
  error: string | null;
}

/**
 * Serviço de gerenciamento de progresso de aulas usando Signals.
 * Atualmente mockado, preparado para integração com backend.
 */
@Injectable({
  providedIn: 'root',
})
export class LessonProgressService {
  private readonly authService = inject(AuthService);

  /**
   * Signal com o estado completo de progresso.
   */
  private readonly stateSignal = signal<ProgressState>({
    lessonProgresses: [],
    courseProgresses: [],
    moduleProgresses: [],
    isLoading: false,
    error: null,
  });

  /**
   * Lista de progressos de aulas (computed).
   */
  readonly lessonProgresses = computed(
    () => this.stateSignal().lessonProgresses,
  );

  /**
   * Lista de progressos de cursos (computed).
   */
  readonly courseProgresses = computed(
    () => this.stateSignal().courseProgresses,
  );

  /**
   * Lista de progressos de módulos (computed).
   */
  readonly moduleProgresses = computed(
    () => this.stateSignal().moduleProgresses,
  );

  /**
   * Indica se está carregando (computed).
   */
  readonly isLoading = computed(() => this.stateSignal().isLoading);

  /**
   * Erro atual (computed).
   */
  readonly error = computed(() => this.stateSignal().error);

  /**
   * Obtém o progresso de uma aula específica.
   *
   * @param lessonId - ID da aula
   * @returns Progresso da aula ou null
   */
  getLessonProgress(lessonId: string): LessonProgress | null {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return null;

    return (
      this.lessonProgresses().find(
        (lp) => lp.lessonId === lessonId && lp.userId === userId,
      ) || null
    );
  }

  /**
   * Verifica se uma aula está concluída.
   *
   * @param lessonId - ID da aula
   * @returns true se a aula está concluída
   */
  isLessonCompleted(lessonId: string): boolean {
    const progress = this.getLessonProgress(lessonId);
    return progress?.isCompleted ?? false;
  }

  /**
   * Marca uma aula como concluída.
   * Em produção, faria uma chamada HTTP.
   *
   * @param lessonId - ID da aula
   * @returns Promise com o progresso atualizado
   */
  async completeLesson(lessonId: string): Promise<LessonProgress> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(300);

      const currentProgresses = this.stateSignal().lessonProgresses;
      const existingIndex = currentProgresses.findIndex(
        (lp) => lp.lessonId === lessonId && lp.userId === userId,
      );

      const now = new Date();
      const updatedProgress: LessonProgress = {
        id:
          existingIndex >= 0
            ? currentProgresses[existingIndex].id
            : this.generateId(),
        userId,
        lessonId,
        completionPercentage: 100,
        timeWatchedSeconds:
          existingIndex >= 0
            ? currentProgresses[existingIndex].timeWatchedSeconds
            : 0,
        isCompleted: true,
        lastAccessedAt: now,
        completedAt: now,
        createdAt:
          existingIndex >= 0 ? currentProgresses[existingIndex].createdAt : now,
        updatedAt: now,
      };

      const updatedProgresses = [...currentProgresses];
      if (existingIndex >= 0) {
        updatedProgresses[existingIndex] = updatedProgress;
      } else {
        updatedProgresses.push(updatedProgress);
      }

      this.updateState({
        lessonProgresses: updatedProgresses,
        isLoading: false,
      });

      // Atualiza progresso do curso e módulo
      await this.updateCourseAndModuleProgress(lessonId);

      return updatedProgress;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao marcar aula como concluída';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Atualiza o progresso de uma aula (tempo assistido).
   * Em produção, faria uma chamada HTTP.
   *
   * @param lessonId - ID da aula
   * @param timeWatchedSeconds - Tempo assistido em segundos
   * @param completionPercentage - Percentual de conclusão (0-100)
   */
  async updateLessonProgress(
    lessonId: string,
    timeWatchedSeconds: number,
    completionPercentage: number,
  ): Promise<void> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    try {
      await this.delay(200);

      const currentProgresses = this.stateSignal().lessonProgresses;
      const existingIndex = currentProgresses.findIndex(
        (lp) => lp.lessonId === lessonId && lp.userId === userId,
      );

      const now = new Date();
      const updatedProgress: LessonProgress = {
        id:
          existingIndex >= 0
            ? currentProgresses[existingIndex].id
            : this.generateId(),
        userId,
        lessonId,
        completionPercentage: Math.min(100, Math.max(0, completionPercentage)),
        timeWatchedSeconds,
        isCompleted: completionPercentage >= 100,
        lastAccessedAt: now,
        completedAt:
          completionPercentage >= 100 && existingIndex >= 0
            ? currentProgresses[existingIndex].completedAt || now
            : existingIndex >= 0
              ? currentProgresses[existingIndex].completedAt
              : undefined,
        createdAt:
          existingIndex >= 0 ? currentProgresses[existingIndex].createdAt : now,
        updatedAt: now,
      };

      const updatedProgresses = [...currentProgresses];
      if (existingIndex >= 0) {
        updatedProgresses[existingIndex] = updatedProgress;
      } else {
        updatedProgresses.push(updatedProgress);
      }

      this.updateState({ lessonProgresses: updatedProgresses });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  }

  /**
   * Carrega progresso de um curso.
   * Em produção, faria uma chamada HTTP.
   *
   * @param courseId - ID do curso
   * @returns Promise com progresso do curso
   */
  async loadCourseProgress(courseId: string): Promise<CourseProgress | null> {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return null;

    this.updateState({ isLoading: true, error: null });

    try {
      await this.delay(300);

      // Em produção, viria do backend
      const progress = this.calculateCourseProgress(courseId, userId);

      if (progress) {
        const currentProgresses = this.stateSignal().courseProgresses;
        const existingIndex = currentProgresses.findIndex(
          (cp) => cp.courseId === courseId && cp.userId === userId,
        );

        const updatedProgresses = [...currentProgresses];
        if (existingIndex >= 0) {
          updatedProgresses[existingIndex] = progress;
        } else {
          updatedProgresses.push(progress);
        }

        this.updateState({
          courseProgresses: updatedProgresses,
          isLoading: false,
        });
      }

      return progress;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar progresso do curso';
      this.updateState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Atualiza progresso do curso e módulo após completar uma aula.
   *
   * @param lessonId - ID da aula concluída
   */
  private async updateCourseAndModuleProgress(lessonId: string): Promise<void> {
    // Em produção, isso seria feito no backend
    // Por enquanto, apenas atualiza localmente
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    // Busca o módulo da aula (em produção viria do backend)
    // Por enquanto, assume que a aula pertence a um curso
    // Esta lógica seria expandida com dados reais do backend
  }

  /**
   * Calcula o progresso de um curso.
   *
   * @param courseId - ID do curso
   * @param userId - ID do usuário
   * @returns Progresso do curso ou null
   */
  private calculateCourseProgress(
    courseId: string,
    userId: string,
  ): CourseProgress | null {
    const userProgresses = this.lessonProgresses().filter(
      (lp) => lp.userId === userId,
    );

    // Em produção, viria do backend com informações completas
    // Por enquanto, retorna null (seria calculado com dados reais)
    return null;
  }

  /**
   * Atualiza o estado de forma imutável.
   *
   * @param updates - Atualizações parciais do estado
   */
  private updateState(updates: Partial<ProgressState>): void {
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
