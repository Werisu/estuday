import { Component, inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidationUtil } from '@estuday/shared';

/**
 * Componente base para formulários.
 * Fornece métodos comuns de validação e navegação.
 */
@Component({
  template: '',
  standalone: true,
})
export abstract class BaseFormComponent {
  protected readonly router = inject(Router);

  /**
   * Formulário reativo (deve ser implementado pelas classes filhas).
   */
  protected abstract readonly form: FormGroup;

  /**
   * Caminho para redirecionar ao cancelar (deve ser implementado pelas classes filhas).
   */
  protected abstract get cancelRoute(): string[];

  /**
   * Verifica se um campo tem erro.
   *
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro
   */
  protected hasError(fieldName: string): boolean {
    return FormValidationUtil.hasFieldError(this.form, fieldName);
  }

  /**
   * Obtém mensagem de erro de um campo.
   *
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  protected getErrorMessage(fieldName: string): string {
    return FormValidationUtil.getFieldErrorMessage(this.form, fieldName);
  }

  /**
   * Obtém o controle de um campo.
   *
   * @param fieldName - Nome do campo
   * @returns Controle ou null
   */
  protected getControl(fieldName: string): AbstractControl | null {
    return FormValidationUtil.getControl(this.form, fieldName);
  }

  /**
   * Marca todos os campos como tocados (útil para exibir erros após submit).
   */
  protected markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  /**
   * Cancela e navega de volta.
   */
  protected cancel(): void {
    this.router.navigate(this.cancelRoute);
  }

  /**
   * Verifica se o formulário é válido.
   *
   * @returns true se o formulário é válido
   */
  protected isValid(): boolean {
    return this.form.valid;
  }

  /**
   * Verifica se o formulário foi modificado.
   *
   * @returns true se o formulário foi modificado
   */
  protected isDirty(): boolean {
    return this.form.dirty;
  }
}
