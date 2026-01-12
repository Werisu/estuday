import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Componente raiz do aplicativo web-admin.
 * Responsável apenas por renderizar o router-outlet para lazy loading.
 */
@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
