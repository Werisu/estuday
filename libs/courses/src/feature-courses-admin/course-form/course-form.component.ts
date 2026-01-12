import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../data-access';
import { BaseFormComponent } from '../../ui';
import { Course, CreateCourse, UpdateCourse } from '@estuday/shared';

/**
 * Componente de formulário de curso (criação e edição).
 */
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.scss',
})
export class CourseFormComponent
  extends BaseFormComponent
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);

  /**
   * Formulário reativo de curso.
   */
  protected readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    coverImageUrl: [''],
    level: [
      'beginner' as 'beginner' | 'intermediate' | 'advanced',
      [Validators.required],
    ],
    durationHours: [0, [Validators.required, Validators.min(1)]],
    status: [
      'draft' as 'draft' | 'published' | 'archived',
      [Validators.required],
    ],
  });

  /**
   * Getter para compatibilidade com template.
   */
  get courseForm(): FormGroup {
    return this.form;
  }

  /**
   * Rota para cancelamento.
   */
  protected get cancelRoute(): string[] {
    return ['/admin/courses'];
  }

  /**
   * Signal com o curso a ser editado (null para criação).
   */
  readonly course = signal<Course | null>(null);

  /**
   * Indica se está processando.
   */
  readonly isProcessing = this.coursesService.isLoading;

  /**
   * Indica se é modo de edição.
   */
  readonly isEditMode = computed(() => this.course() !== null);

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      // Modo de edição - carrega o curso
      this.loadCourse(courseId);
    }
    // Modo de criação - não precisa carregar nada
  }

  /**
   * Carrega o curso para edição.
   *
   * @param id - ID do curso
   */
  async loadCourse(id: string): Promise<void> {
    try {
      const course = await this.coursesService.getCourseById(id);
      if (course) {
        this.course.set(course);
        this.form.patchValue({
          title: course.title,
          description: course.description,
          coverImageUrl: course.coverImageUrl || '',
          level: course.level,
          durationHours: course.durationHours,
          status: course.status,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
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
      const courseToEdit = this.course();

      if (courseToEdit) {
        // Edição
        const updateData: UpdateCourse = {
          title: formValue.title!,
          description: formValue.description!,
          coverImageUrl: formValue.coverImageUrl || undefined,
          level: formValue.level!,
          durationHours: formValue.durationHours!,
          status: formValue.status!,
        };

        await this.coursesService.updateCourse(courseToEdit.id, updateData);
      } else {
        // Criação
        const createData: CreateCourse = {
          title: formValue.title!,
          description: formValue.description!,
          coverImageUrl: formValue.coverImageUrl || undefined,
          level: formValue.level!,
          durationHours: formValue.durationHours!,
          status: formValue.status!,
        };

        await this.coursesService.createCourse(createData);
      }

      this.router.navigate(this.cancelRoute);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
    }
  }
}
