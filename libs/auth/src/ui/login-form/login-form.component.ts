import { Component, output, input, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials } from '../../models';

/**
 * Componente de formulário de login reutilizável.
 * Emite evento quando o formulário é submetido.
 */
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);

  /**
   * Evento emitido quando o formulário é submetido com credenciais válidas.
   */
  readonly loginSubmit = output<LoginCredentials>();

  /**
   * Indica se o formulário está desabilitado.
   */
  readonly disabled = input<boolean>(false);

  /**
   * Formulário reativo de login.
   */
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Indica se o formulário foi submetido (para exibir erros).
   */
  protected submitted = false;

  constructor() {
    // Atualiza o estado do formulário quando disabled muda
    effect(() => {
      if (this.disabled()) {
        this.loginForm.disable();
      } else {
        this.loginForm.enable();
      }
    });
  }

  /**
   * Verifica se um campo tem erro.
   *
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro
   */
  protected hasError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.touched || field.dirty || this.submitted)
    );
  }

  /**
   * Obtém mensagem de erro de um campo.
   *
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  protected getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName === 'email' ? 'Email' : 'Senha'} é obrigatório`;
    }

    if (field.errors['email']) {
      return 'Email inválido';
    }

    if (field.errors['minlength']) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }

    return '';
  }

  /**
   * Manipula o submit do formulário.
   */
  protected onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.loginSubmit.emit(credentials);
    }
  }
}
