import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@estuday/auth').then((m) => m.LoginComponent),
  },
];
