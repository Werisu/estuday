import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser, LoginCredentials, AuthState } from '../models';

/**
 * Serviço de autenticação usando Signals.
 * Gerencia o estado de autenticação e operações relacionadas.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);

  /**
   * Signal com o usuário autenticado.
   * null quando não há usuário autenticado.
   */
  private readonly userSignal = signal<AuthUser | null>(null);

  /**
   * Signal indicando se está carregando.
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Estado completo da autenticação (computed).
   */
  readonly authState = computed<AuthState>(() => ({
    user: this.userSignal(),
    isLoading: this.loadingSignal(),
    isAuthenticated: this.userSignal() !== null,
  }));

  /**
   * Usuário atual (computed).
   */
  readonly currentUser = computed(() => this.userSignal());

  /**
   * Indica se está autenticado (computed).
   */
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  /**
   * Indica se está carregando (computed).
   */
  readonly isLoading = computed(() => this.loadingSignal());

  /**
   * Role do usuário atual (computed).
   */
  readonly currentRole = computed(() => this.userSignal()?.role ?? null);

  constructor() {
    // Verifica se há usuário salvo no localStorage
    this.loadUserFromStorage();
  }

  /**
   * Realiza login com credenciais.
   * Mockado para demonstração.
   *
   * @param credentials - Credenciais de login
   * @returns Promise resolvida com o usuário autenticado
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    this.loadingSignal.set(true);

    try {
      // Simula delay de requisição
      await this.delay(1000);

      // Mock de autenticação
      const user = this.mockLogin(credentials);

      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Salva no signal e localStorage
      this.userSignal.set(user);
      this.saveUserToStorage(user);

      return user;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Realiza logout do usuário.
   */
  logout(): void {
    this.userSignal.set(null);
    this.removeUserFromStorage();
    this.router.navigate(['/login']);
  }

  /**
   * Verifica se o usuário tem uma role específica.
   *
   * @param role - Role a ser verificada
   * @returns true se o usuário tem a role
   */
  hasRole(role: string): boolean {
    return this.currentRole() === role;
  }

  /**
   * Verifica se o usuário tem uma das roles especificadas.
   *
   * @param roles - Array de roles a serem verificadas
   * @returns true se o usuário tem pelo menos uma das roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentRole();
    return userRole !== null && roles.includes(userRole);
  }

  /**
   * Mock de autenticação para demonstração.
   * Em produção, isso seria uma chamada HTTP real.
   *
   * @param credentials - Credenciais de login
   * @returns Usuário autenticado ou null
   */
  private mockLogin(credentials: LoginCredentials): AuthUser | null {
    // Usuários mockados para demonstração
    const mockUsers: Record<string, AuthUser> = {
      'admin@estuday.com': {
        id: '1',
        name: 'Administrador',
        email: 'admin@estuday.com',
        role: 'ADMIN',
        token: 'mock-token-admin-123',
      },
      'student@estuday.com': {
        id: '2',
        name: 'Aluno Teste',
        email: 'student@estuday.com',
        role: 'STUDENT',
        token: 'mock-token-student-456',
      },
    };

    // Senha padrão para ambos: "123456"
    if (credentials.password === '123456') {
      return mockUsers[credentials.email] || null;
    }

    return null;
  }

  /**
   * Salva usuário no localStorage.
   *
   * @param user - Usuário a ser salvo
   */
  private saveUserToStorage(user: AuthUser): void {
    try {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário no localStorage:', error);
    }
  }

  /**
   * Carrega usuário do localStorage.
   */
  private loadUserFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        const user = JSON.parse(stored) as AuthUser;
        this.userSignal.set(user);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      this.removeUserFromStorage();
    }
  }

  /**
   * Remove usuário do localStorage.
   */
  private removeUserFromStorage(): void {
    try {
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Erro ao remover usuário do localStorage:', error);
    }
  }

  /**
   * Delay para simular requisição HTTP.
   *
   * @param ms - Milissegundos de delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
