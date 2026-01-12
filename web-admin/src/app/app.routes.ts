import { Route } from '@angular/router';
import { adminGuard, authGuard } from '@estuday/auth';
import { coursesRoutes } from './features/courses/courses.routes';

/**
 * Rotas principais do aplicativo web-admin.
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
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'courses',
        children: coursesRoutes,
      },
    ],
  },
];
