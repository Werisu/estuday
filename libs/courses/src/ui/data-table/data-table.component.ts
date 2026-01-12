import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface para colunas da tabela.
 */
export interface TableColumn {
  /** Chave da propriedade */
  key: string;

  /** Label da coluna */
  label: string;

  /** Função de formatação opcional */
  format?: (value: any) => string;
}

/**
 * Componente de tabela de dados reutilizável.
 * Exibe dados em formato tabular com ações.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T extends Record<string, any>> {
  /** Dados a serem exibidos */
  readonly data = input.required<T[]>();

  /** Colunas da tabela */
  readonly columns = input.required<TableColumn[]>();

  /** Indica se está carregando */
  readonly isLoading = input<boolean>(false);

  /** Evento emitido ao clicar em editar */
  readonly onEdit = output<T>();

  /** Evento emitido ao clicar em remover */
  readonly onDelete = output<T>();

  /**
   * Obtém o valor formatado de uma célula.
   *
   * @param item - Item da linha
   * @param column - Coluna
   * @returns Valor formatado
   */
  protected getCellValue(item: T, column: TableColumn): string {
    const value = item[column.key];
    if (column.format) {
      return column.format(value);
    }
    return value ?? '';
  }

  /**
   * Manipula clique em editar.
   *
   * @param item - Item a ser editado
   */
  protected handleEdit(item: T): void {
    this.onEdit.emit(item);
  }

  /**
   * Manipula clique em remover.
   *
   * @param item - Item a ser removido
   */
  protected handleDelete(item: T): void {
    if (confirm('Tem certeza que deseja remover este item?')) {
      this.onDelete.emit(item);
    }
  }

  /**
   * Função de trackBy para otimização de renderização.
   *
   * @param item - Item da lista
   * @returns ID do item
   */
  protected getTrackBy(item: T): string {
    return (item as any).id || JSON.stringify(item);
  }
}
