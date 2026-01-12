/**
 * Modelo de dados para usuário do sistema.
 */
export interface User {
  /** Identificador único do usuário */
  id: string;

  /** Nome completo do usuário */
  name: string;

  /** Email do usuário */
  email: string;

  /** URL da foto de perfil (opcional) */
  avatarUrl?: string;

  /** Data de criação da conta */
  createdAt: Date;

  /** Data da última atualização */
  updatedAt: Date;
}

/**
 * Tipo para criação de novo usuário (sem campos gerados automaticamente).
 */
export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo para atualização parcial de usuário.
 */
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>>;
