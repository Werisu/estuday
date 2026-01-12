import { Route } from '@angular/router';

/**
 * Rotas relacionadas a cursos no aplicativo do estudante.
 * Agrupadas para melhor organização e manutenção.
 */
export const coursesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.CourseListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.CourseDetailComponent),
  },
];
