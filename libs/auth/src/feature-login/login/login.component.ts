import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access';
import { LoginFormComponent } from '../../ui';
import { LoginCredentials } from '../../models';

/**
 * Componente de página de login.
 * Integra o formulário de login com o AuthService.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Signal indicando se está processando o login.
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // Redireciona automaticamente se já estiver autenticado
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.redirectBasedOnRole(user.role);
      }
    });
  }

  /**
   * Manipula o submit do formulário de login.
   *
   * @param credentials - Credenciais de login
   */
  protected async onLoginSubmit(credentials: LoginCredentials): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const user = await this.authService.login(credentials);
      this.redirectBasedOnRole(user.role);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Redireciona o usuário baseado na sua role.
   *
   * @param role - Role do usuário
   */
  private redirectBasedOnRole(role: string): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (role === 'STUDENT') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
