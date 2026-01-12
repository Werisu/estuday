import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModulesService, CoursesService } from '../../data-access';
import { BaseFormComponent } from '../../ui';
import { CreateModule, Module, UpdateModule } from '@estuday/shared';

/**
 * Componente de formulário de módulo (criação e edição).
 */
@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './module-form.component.html',
  styleUrl: './module-form.component.scss',
})
export class ModuleFormComponent
  extends BaseFormComponent
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);

  /**
   * Formulário reativo de módulo.
   */
  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    order: [1, [Validators.required, Validators.min(1)]],
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    status: [
      'draft' as 'draft' | 'published' | 'archived',
      [Validators.required],
    ],
  });

  /**
   * Getter para compatibilidade com template.
   */
  get moduleForm(): FormGroup {
    return this.form;
  }

  /**
   * Rota para cancelamento.
   */
  protected get cancelRoute(): string[] {
    const courseId = this.courseId();
    if (courseId) {
      return ['/admin/courses', courseId, 'modules'];
    }
    return ['/admin/courses'];
  }

  /**
   * Signal com o módulo a ser editado (null para criação).
   */
  readonly module = signal<Module | null>(null);

  /**
   * Signal com o ID do curso.
   */
  readonly courseId = signal<string | null>(null);

  /**
   * Indica se está processando.
   */
  readonly isProcessing = this.modulesService.isLoading;

  /**
   * Indica se é modo de edição.
   */
  readonly isEditMode = computed(() => this.module() !== null);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const moduleId = this.route.snapshot.paramMap.get('id');

    if (courseId) {
      this.courseId.set(courseId);
    } else {
      this.router.navigate(['/admin/courses']);
      return;
    }

    if (moduleId) {
      // Modo de edição - carrega o módulo
      this.loadModule(courseId, moduleId);
    }
    // Modo de criação - não precisa carregar nada
  }

  /**
   * Carrega o módulo para edição.
   *
   * @param courseId - ID do curso
   * @param moduleId - ID do módulo
   */
  async loadModule(courseId: string, moduleId: string): Promise<void> {
    try {
      await this.coursesService.getCourseById(courseId);
      await this.modulesService.loadModulesByCourse(courseId);

      const modules = this.modulesService.modules();
      const moduleToEdit = modules.find((m) => m.id === moduleId);

      if (moduleToEdit) {
        this.module.set(moduleToEdit);
        this.form.patchValue({
          title: moduleToEdit.title,
          description: moduleToEdit.description,
          order: moduleToEdit.order,
          durationMinutes: moduleToEdit.durationMinutes,
          status: moduleToEdit.status,
        });
      } else {
        this.router.navigate(this.cancelRoute);
      }
    } catch (error) {
      console.error('Erro ao carregar módulo:', error);
      this.router.navigate(this.cancelRoute);
    }
  }

  /**
   * Manipula o submit do formulário.
   */
  protected async onSubmit(): Promise<void> {
    if (!this.isValid()) {
      this.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.form.value;
      const moduleToEdit = this.module();
      const courseId = this.courseId();

      if (!courseId) {
        return;
      }

      if (moduleToEdit) {
        // Edição
        const updateData: UpdateModule = {
          title: formValue.title!,
          description: formValue.description!,
          order: formValue.order!,
          durationMinutes: formValue.durationMinutes!,
          status: formValue.status!,
        };

        await this.modulesService.updateModule(moduleToEdit.id, updateData);
      } else {
        // Criação
        const createData: CreateModule = {
          courseId,
          title: formValue.title!,
          description: formValue.description!,
          order: formValue.order!,
          durationMinutes: formValue.durationMinutes!,
          status: formValue.status!,
        };

        await this.modulesService.createModule(createData);
      }

      this.router.navigate(this.cancelRoute);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
    }
  }
}
