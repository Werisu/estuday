import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../models';

/**
 * Guard que protege rotas exigindo uma role específica.
 * Redireciona para /login se o usuário não estiver autenticado
 * ou não tiver a role necessária.
 *
 * @param allowedRoles - Roles permitidas para acessar a rota
 * @returns Guard function
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Verifica autenticação
    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    // Verifica se o usuário tem uma das roles permitidas
    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // Redireciona para página não autorizada ou home
    router.navigate(['/']);
    return false;
  };
};

/**
 * Guard específico para rotas de ADMIN.
 */
export const adminGuard: CanActivateFn = roleGuard(['ADMIN']);

/**
 * Guard específico para rotas de STUDENT.
 */
export const studentGuard: CanActivateFn = roleGuard(['STUDENT']);
