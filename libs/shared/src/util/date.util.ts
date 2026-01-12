/**
 * Utilitários para manipulação de datas.
 */

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY).
 *
 * @param date - Data a ser formatada
 * @returns String formatada no padrão DD/MM/YYYY
 *
 * @example
 * formatDateBR(new Date('2024-01-15'))
 * // Retorna: "15/01/2024"
 */
export function formatDateBR(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata uma data para o formato completo brasileiro (DD de MMMM de YYYY).
 *
 * @param date - Data a ser formatada
 * @returns String formatada no padrão "15 de janeiro de 2024"
 *
 * @example
 * formatDateBRFull(new Date('2024-01-15'))
 * // Retorna: "15 de janeiro de 2024"
 */
export function formatDateBRFull(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata uma data para exibição relativa (ex: "há 2 dias").
 *
 * @param date - Data a ser formatada
 * @returns String com tempo relativo
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
 * // Retorna: "há 2 dias"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
}
