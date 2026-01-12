import { Component } from '@angular/core';

/**
 * Componente Dashboard do painel administrativo.
 * Exibe visão geral e métricas principais do sistema.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly title = 'Dashboard Administrativo';
}
