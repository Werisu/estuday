import { Route } from '@angular/router';
import { authGuard, studentGuard } from '@estuday/auth';
import { coursesRoutes } from './features/courses/courses.routes';

/**
 * Rotas principais do aplicativo web-student.
 * Utiliza lazy loading para carregar features sob demanda.
 * Guards aplicados em todas as rotas protegidas.
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
      {
        path: 'courses',
        children: coursesRoutes,
      },
    ],
  },
];
