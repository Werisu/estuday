/**
 * Utilitários para validação de dados.
 */

/**
 * Valida se uma string é um email válido.
 *
 * @param email - Email a ser validado
 * @returns true se o email é válido, false caso contrário
 *
 * @example
 * isValidEmail('user@example.com')
 * // Retorna: true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma string é uma URL válida.
 *
 * @param url - URL a ser validada
 * @returns true se a URL é válida, false caso contrário
 *
 * @example
 * isValidUrl('https://example.com')
 * // Retorna: true
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida se uma string não está vazia (após trim).
 *
 * @param str - String a ser validada
 * @returns true se a string não está vazia, false caso contrário
 *
 * @example
 * isNotEmpty('  hello  ')
 * // Retorna: true
 */
export function isNotEmpty(str: string): boolean {
  return str.trim().length > 0;
}

/**
 * Valida se um valor está dentro de um range numérico.
 *
 * @param value - Valor a ser validado
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 * @returns true se o valor está no range, false caso contrário
 *
 * @example
 * isInRange(5, 1, 10)
 * // Retorna: true
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
