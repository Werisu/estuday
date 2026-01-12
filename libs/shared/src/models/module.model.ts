/**
 * Modelo de dados para módulo de curso.
 * Um módulo agrupa várias aulas relacionadas.
 */
export interface Module {
  /** Identificador único do módulo */
  id: string;

  /** Identificador do curso ao qual o módulo pertence */
  courseId: string;

  /** Título do módulo */
  title: string;

  /** Descrição do módulo */
  description: string;

  /** Ordem de exibição do módulo no curso */
  order: number;

  /** Duração estimada do módulo em minutos */
  durationMinutes: number;

  /** Status do módulo */
  status: 'draft' | 'published' | 'archived';

  /** Data de criação */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo para criação de novo módulo.
 */
export type CreateModule = Omit<Module, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo para atualização parcial de módulo.
 */
export type UpdateModule = Partial<
  Omit<Module, 'id' | 'courseId' | 'createdAt'>
>;

/**
 * Módulo com informações adicionais (ex: contagem de aulas).
 */
export interface ModuleWithDetails extends Module {
  /** Número total de aulas no módulo */
  lessonsCount: number;

  /** Número de aulas concluídas pelo usuário (opcional) */
  completedLessonsCount?: number;
}
