import { Route } from '@angular/router';

/**
 * Rotas relacionadas a cursos no painel administrativo.
 * Agrupadas para melhor organização e manutenção.
 */
export const coursesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.CoursesAdminComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.CourseFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.CourseFormComponent),
  },
  {
    path: ':courseId/modules',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.ModulesAdminComponent),
  },
  {
    path: ':courseId/modules/new',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.ModuleFormComponent),
  },
  {
    path: ':courseId/modules/:id/edit',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.ModuleFormComponent),
  },
  {
    path: ':courseId/modules/:moduleId/lessons',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.LessonsAdminComponent),
  },
  {
    path: ':courseId/modules/:moduleId/lessons/new',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.LessonFormComponent),
  },
  {
    path: ':courseId/modules/:moduleId/lessons/:id/edit',
    loadComponent: () =>
      import('@estuday/courses').then((m) => m.LessonFormComponent),
  },
];
