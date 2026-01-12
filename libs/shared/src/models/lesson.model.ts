import { LessonProgress } from './lesson-progress.model';

/**
 * Modelo de dados para aula.
 * Uma aula pertence a um módulo e pode ter diferentes tipos de conteúdo.
 */
export interface Lesson {
  /** Identificador único da aula */
  id: string;

  /** Identificador do módulo ao qual a aula pertence */
  moduleId: string;

  /** Título da aula */
  title: string;

  /** Descrição da aula */
  description: string;

  /** Tipo de conteúdo da aula */
  contentType: 'video' | 'text' | 'quiz' | 'exercise' | 'document';

  /** URL do conteúdo (vídeo, documento, etc.) */
  contentUrl?: string;

  /** Conteúdo em texto (para aulas do tipo text) */
  textContent?: string;

  /** Duração estimada da aula em minutos */
  durationMinutes: number;

  /** Ordem de exibição da aula no módulo */
  order: number;

  /** Indica se a aula é gratuita (não requer assinatura) */
  isFree: boolean;

  /** Status da aula */
  status: 'draft' | 'published' | 'archived';

  /** Data de criação */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo para criação de nova aula.
 */
export type CreateLesson = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo para atualização parcial de aula.
 */
export type UpdateLesson = Partial<
  Omit<Lesson, 'id' | 'moduleId' | 'createdAt'>
>;

/**
 * Aula com informações adicionais (ex: progresso do usuário).
 */
export interface LessonWithDetails extends Lesson {
  /** Progresso da aula pelo usuário (opcional) */
  progress?: LessonProgress;

  /** Indica se a aula foi concluída pelo usuário */
  isCompleted?: boolean;
}
