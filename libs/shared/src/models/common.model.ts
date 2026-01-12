/**
 * Modelos e tipos comuns utilizados em toda a aplicação.
 */

/**
 * Resultado de uma operação que pode falhar.
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Estado de carregamento assíncrono.
 */
export type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/**
 * Paginação de resultados.
 */
export interface Pagination {
  /** Página atual (baseado em 1) */
  page: number;

  /** Número de itens por página */
  pageSize: number;

  /** Total de itens disponíveis */
  total: number;

  /** Total de páginas */
  totalPages: number;
}

/**
 * Resposta paginada de uma API.
 */
export interface PaginatedResponse<T> {
  /** Dados da página atual */
  data: T[];

  /** Informações de paginação */
  pagination: Pagination;
}

/**
 * Parâmetros de paginação para requisições.
 */
export interface PaginationParams {
  /** Página desejada (baseado em 1) */
  page?: number;

  /** Tamanho da página */
  pageSize?: number;
}
