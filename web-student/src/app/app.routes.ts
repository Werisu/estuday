import { Route } from '@angular/router';
import { authGuard, studentGuard } from '@estuday/auth';

/**
 * Rotas principais do aplicativo web-student.
 * Utiliza lazy loading para carregar features sob demanda.
 */
export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@estuday/auth').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard, studentGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
    ],
  },
];
