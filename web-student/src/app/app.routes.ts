import { Route } from '@angular/router';

/**
 * Rotas principais do aplicativo web-student.
 * Utiliza lazy loading para carregar features sob demanda.
 */
export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
  },
];
