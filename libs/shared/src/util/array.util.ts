/**
 * Utilitários para manipulação de arrays.
 */

/**
 * Remove itens duplicados de um array mantendo apenas valores únicos.
 *
 * @param array - Array com possíveis duplicatas
 * @returns Novo array sem duplicatas
 *
 * @example
 * unique([1, 2, 2, 3, 3, 3])
 * // Retorna: [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Agrupa itens de um array por uma chave específica.
 *
 * @param array - Array a ser agrupado
 * @param keyFn - Função que retorna a chave de agrupamento
 * @returns Objeto com chaves e arrays agrupados
 *
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}], item => item.type)
 * // Retorna: { a: [{type: 'a', val: 1}, {type: 'a', val: 3}], b: [{type: 'b', val: 2}] }
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

/**
 * Ordena um array por uma propriedade específica.
 *
 * @param array - Array a ser ordenado
 * @param keyFn - Função que retorna o valor para ordenação
 * @param direction - Direção da ordenação ('asc' ou 'desc')
 * @returns Novo array ordenado
 *
 * @example
 * sortBy([{name: 'b'}, {name: 'a'}, {name: 'c'}], item => item.name)
 * // Retorna: [{name: 'a'}, {name: 'b'}, {name: 'c'}]
 */
export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  const sorted = [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}
