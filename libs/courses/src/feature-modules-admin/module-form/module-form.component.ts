import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService, CoursesService } from '../../data-access';
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
export class ModuleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o módulo a ser editado (null para criação).
   */
  readonly module = signal<Module | null>(null);

  /**
   * Signal com o ID do curso.
   */
  readonly courseId = signal<string | null>(null);

  /**
   * Formulário reativo de módulo.
   */
  readonly moduleForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    order: [1, [Validators.required, Validators.min(1)]],
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    status: ['draft' as 'draft' | 'published' | 'archived', [Validators.required]],
  });

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
        this.moduleForm.patchValue({
          title: moduleToEdit.title,
          description: moduleToEdit.description,
          order: moduleToEdit.order,
          durationMinutes: moduleToEdit.durationMinutes,
          status: moduleToEdit.status,
        });
      } else {
        this.router.navigate(['/admin/courses', courseId, 'modules']);
      }
    } catch (error) {
      console.error('Erro ao carregar módulo:', error);
      const courseId = this.courseId();
      if (courseId) {
        this.router.navigate(['/admin/courses', courseId, 'modules']);
      }
    }
  }

  /**
   * Manipula o submit do formulário.
   */
  protected async onSubmit(): Promise<void> {
    if (this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.moduleForm.value;
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

      this.router.navigate(['/admin/courses', courseId, 'modules']);
    } catch (error) {
      console.error('Erro ao salvar módulo:', error);
    }
  }

  /**
   * Cancela e volta para a lista.
   */
  protected cancel(): void {
    const courseId = this.courseId();
    if (courseId) {
      this.router.navigate(['/admin/courses', courseId, 'modules']);
    } else {
      this.router.navigate(['/admin/courses']);
    }
  }

  /**
   * Verifica se um campo tem erro.
   *
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro
   */
  protected hasError(fieldName: string): boolean {
    const field = this.moduleForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.touched || field.dirty)
    );
  }

  /**
   * Obtém mensagem de erro de um campo.
   *
   * @param fieldName - Nome do campo
   * @returns Mensagem de erro ou string vazia
   */
  protected getErrorMessage(fieldName: string): string {
    const field = this.moduleForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Campo obrigatório';
    }

    if (field.errors['minlength']) {
      return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
    }

    if (field.errors['min']) {
      return `Valor mínimo: ${field.errors['min'].min}`;
    }

    return '';
  }
}
