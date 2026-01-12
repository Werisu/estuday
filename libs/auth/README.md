# @estuday/auth

Biblioteca de autenticação do EstuDay seguindo o padrão Nx com separação em data-access, feature-login e ui.

## Estrutura

```
src/
├── models/          # Interfaces e tipos (AuthUser, LoginCredentials, etc.)
├── data-access/     # AuthService e Guards
├── ui/              # Componentes UI reutilizáveis (LoginFormComponent)
├── feature-login/   # Feature completa de login
└── index.ts         # Exports principais
```

## Uso

### AuthService

O `AuthService` utiliza Signals para gerenciar o estado de autenticação:

```typescript
import { inject } from '@angular/core';
import { AuthService } from '@estuday/auth';

@Component({...})
export class MyComponent {
  private readonly authService = inject(AuthService);

  // Acessar estado de autenticação
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;
  readonly currentRole = this.authService.currentRole;

  // Fazer login
  async login() {
    const user = await this.authService.login({
      email: 'admin@estuday.com',
      password: '123456',
    });
  }

  // Fazer logout
  logout() {
    this.authService.logout();
  }

  // Verificar roles
  const isAdmin = this.authService.hasRole('ADMIN');
  const hasAccess = this.authService.hasAnyRole(['ADMIN', 'STUDENT']);
}
```

### Guards

#### AuthGuard

Protege rotas exigindo autenticação:

```typescript
import { Route } from '@angular/router';
import { authGuard } from '@estuday/auth';

export const routes: Route[] = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard.component'),
  },
];
```

#### RoleGuard

Protege rotas exigindo roles específicas:

```typescript
import { Route } from '@angular/router';
import { adminGuard, studentGuard, roleGuard } from '@estuday/auth';

export const routes: Route[] = [
  {
    path: 'admin',
    canActivate: [adminGuard], // Apenas ADMIN
    loadComponent: () => import('./admin.component'),
  },
  {
    path: 'student',
    canActivate: [studentGuard], // Apenas STUDENT
    loadComponent: () => import('./student.component'),
  },
  {
    path: 'shared',
    canActivate: [roleGuard(['ADMIN', 'STUDENT'])], // ADMIN ou STUDENT
    loadComponent: () => import('./shared.component'),
  },
];
```

### Componente de Login

#### LoginComponent (Feature)

Componente completo de página de login:

```typescript
import { LoginComponent } from '@estuday/auth';

export const routes: Route[] = [
  {
    path: 'login',
    loadComponent: () => LoginComponent,
  },
];
```

#### LoginFormComponent (UI)

Componente de formulário reutilizável:

```typescript
import { LoginFormComponent } from '@estuday/auth';

@Component({
  imports: [LoginFormComponent],
  template: `
    <app-login-form
      (loginSubmit)="onLogin($event)"
      [disabled]="isLoading()"
    />
  `,
})
export class MyComponent {
  onLogin(credentials: LoginCredentials) {
    // Processar login
  }
}
```

## Credenciais de Teste

A autenticação está mockada para demonstração:

- **Admin:**
  - Email: `admin@estuday.com`
  - Senha: `123456`

- **Aluno:**
  - Email: `student@estuday.com`
  - Senha: `123456`

## Modelos

### AuthUser

```typescript
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  token: string;
}
```

### LoginCredentials

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

### AuthState

```typescript
interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
```

## Características

- ✅ Signals para gerenciamento de estado
- ✅ Guards funcionais (CanActivateFn)
- ✅ Injeção via `inject()`
- ✅ Angular Standalone
- ✅ Código tipado e comentado
- ✅ Persistência no localStorage
- ✅ Mock de autenticação para desenvolvimento

## Desenvolvimento

```bash
# Executar testes
nx test auth

# Executar lint
nx lint auth

# Build da biblioteca
nx build auth
```
