/**
 * Modelo de dados para curso.
 */
export interface Course {
  /** Identificador único do curso */
  id: string;

  /** Título do curso */
  title: string;

  /** Descrição do curso */
  description: string;

  /** URL da imagem de capa (opcional) */
  coverImageUrl?: string;

  /** Nível de dificuldade do curso */
  level: 'beginner' | 'intermediate' | 'advanced';

  /** Duração estimada em horas */
  durationHours: number;

  /** Status do curso */
  status: 'draft' | 'published' | 'archived';

  /** Data de criação */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo para criação de novo curso.
 */
export type CreateCourse = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo para atualização parcial de curso.
 */
export type UpdateCourse = Partial<Omit<Course, 'id' | 'createdAt'>>;
