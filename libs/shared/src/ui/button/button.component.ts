import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

/**
 * Componente de botão reutilizável.
 * Suporta diferentes variantes e estados.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /** Texto exibido no botão */
  readonly label = input<string>('');

  /** Variante visual do botão */
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost'>(
    'primary',
  );

  /** Tamanho do botão */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Estado desabilitado */
  readonly disabled = input<boolean>(false);

  /** Tipo do botão */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /** Classes CSS dinâmicas baseadas nas propriedades */
  protected get buttonClasses(): string {
    const classes = ['btn', `btn-${this.variant()}`, `btn-${this.size()}`];
    if (this.disabled()) {
      classes.push('btn-disabled');
    }
    return classes.join(' ');
  }
}
