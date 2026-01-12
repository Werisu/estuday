import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService, CoursesService } from '../../data-access';
import { DataTableComponent, TableColumn } from '../../ui';
import { Module } from '@estuday/shared';

/**
 * Componente de administração de módulos de um curso.
 * Lista, cria, edita e remove módulos.
 */
@Component({
  selector: 'app-modules-admin',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './modules-admin.component.html',
  styleUrl: './modules-admin.component.scss',
})
export class ModulesAdminComponent implements OnInit {
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o ID do curso.
   */
  readonly courseId = signal<string | null>(null);

  /**
   * Signal com a lista de módulos.
   */
  readonly modules = this.modulesService.modules;

  /**
   * Signal com o curso atual.
   */
  readonly course = this.coursesService.selectedCourse;

  /**
   * Signal indicando se está carregando.
   */
  readonly isLoading = this.modulesService.isLoading;

  /**
   * Signal com mensagem de erro (se houver).
   */
  readonly error = this.modulesService.error;

  /**
   * Colunas da tabela de módulos.
   */
  readonly columns: TableColumn[] = [
    { key: 'title', label: 'Título' },
    { key: 'order', label: 'Ordem' },
    { key: 'durationMinutes', label: 'Duração (min)' },
    { key: 'status', label: 'Status', format: (v) => this.formatStatus(v) },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (id) {
      this.courseId.set(id);
      this.loadCourseAndModules(id);
    } else {
      this.router.navigate(['/admin/courses']);
    }
  }

  /**
   * Carrega o curso e seus módulos.
   *
   * @param id - ID do curso
   */
  async loadCourseAndModules(id: string): Promise<void> {
    try {
      await this.coursesService.getCourseById(id);
      await this.modulesService.loadModulesByCourse(id);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    }
  }

  /**
   * Navega para criação de novo módulo.
   */
  protected createModule(): void {
    const courseId = this.courseId();
    if (courseId) {
      this.router.navigate(['/admin/courses', courseId, 'modules', 'new']);
    }
  }

  /**
   * Navega para edição de módulo ou aulas.
   *
   * @param module - Módulo a ser editado
   */
  protected editModule(module: Module): void {
    const courseId = this.courseId();
    if (courseId) {
      // Navega para aulas do módulo (onde pode editar o módulo também)
      this.router.navigate([
        '/admin/courses',
        courseId,
        'modules',
        module.id,
        'lessons',
      ]);
    }
  }

  /**
   * Remove um módulo.
   *
   * @param module - Módulo a ser removido
   */
  protected async deleteModule(module: Module): Promise<void> {
    try {
      await this.modulesService.deleteModule(module.id);
      const courseId = this.courseId();
      if (courseId) {
        await this.loadCourseAndModules(courseId);
      }
    } catch (error) {
      console.error('Erro ao remover módulo:', error);
    }
  }

  /**
   * Volta para a lista de cursos.
   */
  protected goBack(): void {
    this.router.navigate(['/admin/courses']);
  }

  /**
   * Formata o status do módulo.
   *
   * @param status - Status do módulo
   * @returns Texto formatado
   */
  private formatStatus(status: string): string {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'published':
        return 'Publicado';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  }
}
