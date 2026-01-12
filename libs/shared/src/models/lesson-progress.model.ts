/**
 * Modelo de dados para progresso de aula.
 * Rastreia o progresso de um usuário em uma aula específica.
 */
export interface LessonProgress {
  /** Identificador único do progresso */
  id: string;

  /** Identificador do usuário */
  userId: string;

  /** Identificador da aula */
  lessonId: string;

  /** Percentual de conclusão (0-100) */
  completionPercentage: number;

  /** Tempo assistido em segundos */
  timeWatchedSeconds: number;

  /** Indica se a aula foi concluída */
  isCompleted: boolean;

  /** Data/hora do último acesso */
  lastAccessedAt: Date;

  /** Data/hora de conclusão (se concluída) */
  completedAt?: Date;

  /** Data de criação */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo para criação de novo progresso de aula.
 */
export type CreateLessonProgress = Omit<
  LessonProgress,
  'id' | 'createdAt' | 'updatedAt' | 'completedAt'
>;

/**
 * Tipo para atualização parcial de progresso de aula.
 */
export type UpdateLessonProgress = Partial<
  Omit<LessonProgress, 'id' | 'userId' | 'lessonId' | 'createdAt'>
>;

/**
 * Resumo de progresso de um curso.
 */
export interface CourseProgress {
  /** Identificador do curso */
  courseId: string;

  /** Identificador do usuário */
  userId: string;

  /** Total de aulas no curso */
  totalLessons: number;

  /** Número de aulas concluídas */
  completedLessons: number;

  /** Percentual de conclusão do curso (0-100) */
  completionPercentage: number;

  /** Tempo total assistido em segundos */
  totalTimeWatchedSeconds: number;

  /** Data/hora do último acesso ao curso */
  lastAccessedAt: Date;
}

/**
 * Resumo de progresso de um módulo.
 */
export interface ModuleProgress {
  /** Identificador do módulo */
  moduleId: string;

  /** Identificador do usuário */
  userId: string;

  /** Total de aulas no módulo */
  totalLessons: number;

  /** Número de aulas concluídas */
  completedLessons: number;

  /** Percentual de conclusão do módulo (0-100) */
  completionPercentage: number;

  /** Tempo total assistido em segundos */
  totalTimeWatchedSeconds: number;

  /** Data/hora do último acesso ao módulo */
  lastAccessedAt: Date;
}
