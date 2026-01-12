/**
 * Utilitários para manipulação de strings.
 */

/**
 * Capitaliza a primeira letra de uma string.
 *
 * @param str - String a ser capitalizada
 * @returns String com primeira letra maiúscula
 *
 * @example
 * capitalize('hello world')
 * // Retorna: "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Trunca uma string para um tamanho máximo, adicionando "..." se necessário.
 *
 * @param str - String a ser truncada
 * @param maxLength - Tamanho máximo desejado
 * @returns String truncada
 *
 * @example
 * truncate('Texto muito longo', 10)
 * // Retorna: "Texto muit..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Remove acentos de uma string.
 *
 * @param str - String com acentos
 * @returns String sem acentos
 *
 * @example
 * removeAccents('São Paulo')
 * // Retorna: "Sao Paulo"
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converte uma string para slug (URL-friendly).
 *
 * @param str - String a ser convertida
 * @returns Slug gerado
 *
 * @example
 * toSlug('São Paulo - Capital')
 * // Retorna: "sao-paulo-capital"
 */
export function toSlug(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
