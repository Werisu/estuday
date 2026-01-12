import { Component, inject, signal } from '@angular/core';
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

      // Redireciona baseado na role do usuário
      if (user.role === 'ADMIN') {
        this.router.navigate(['/dashboard']);
      } else if (user.role === 'STUDENT') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
