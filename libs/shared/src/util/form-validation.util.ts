import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Utilitários para validação de formulários reativos.
 */
export class FormValidationUtil {
  /**
   * Verifica se um campo do formulário tem erro.
   *
   * @param control - Controle do formulário
   * @returns true se o campo tem erro e foi tocado/modificado
   */
  static hasError(control: AbstractControl | null): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }

  /**
   * Obtém mensagem de erro de um campo do formulário.
   *
   * @param control - Controle do formulário
   * @returns Mensagem de erro ou string vazia
   */
  static getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Campo obrigatório';
    }

    if (errors['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    }

    if (errors['min']) {
      return `Valor mínimo: ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `Valor máximo: ${errors['max'].max}`;
    }

    if (errors['email']) {
      return 'Email inválido';
    }

    if (errors['pattern']) {
      return 'Formato inválido';
    }

    return '';
  }

  /**
   * Obtém o controle de um formulário pelo nome.
   *
   * @param formGroup - Grupo de formulário
   * @param fieldName - Nome do campo
   * @returns Controle ou null
   */
  static getControl(
    formGroup: { get: (name: string) => AbstractControl | null },
    fieldName: string
  ): AbstractControl | null {
    return formGroup.get(fieldName);
  }

  /**
   * Verifica se um campo específico tem erro.
   *
   * @param formGroup - Grupo de formulário
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro
   */
  static hasFieldError(
    formGroup: { get: (name: string) => AbstractControl | null },
    fieldName: string
  ): boolean {
    const control = this.getControl(formGroup, fieldName);
    return this.hasError(control);
  }

  /**
   * Obtém mensagem de erro de um campo específico.
   *
   * @param formGroup - Grupo de formulário
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  static getFieldErrorMessage(
    formGroup: { get: (name: string) => AbstractControl | null },
    fieldName: string
  ): string {
    const control = this.getControl(formGroup, fieldName);
    return this.getErrorMessage(control);
  }
}
