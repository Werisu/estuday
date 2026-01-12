/**
 * Modelos e tipos relacionados à autenticação.
 */

/**
 * Roles disponíveis no sistema.
 */
export type UserRole = 'ADMIN' | 'STUDENT';

/**
 * Dados de credenciais para login.
 */
export interface LoginCredentials {
  /** Email do usuário */
  email: string;

  /** Senha do usuário */
  password: string;
}

/**
 * Dados do usuário autenticado.
 */
export interface AuthUser {
  /** Identificador único do usuário */
  id: string;

  /** Nome completo */
  name: string;

  /** Email */
  email: string;

  /** Role do usuário */
  role: UserRole;

  /** Token de autenticação */
  token: string;
}

/**
 * Estado da autenticação.
 */
export interface AuthState {
  /** Usuário autenticado (null se não autenticado) */
  user: AuthUser | null;

  /** Indica se está carregando */
  isLoading: boolean;

  /** Indica se está autenticado */
  isAuthenticated: boolean;
}
