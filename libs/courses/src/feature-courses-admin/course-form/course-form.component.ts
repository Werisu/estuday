import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../data-access';
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
export class CourseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com o curso a ser editado (null para criação).
   */
  readonly course = signal<Course | null>(null);

  /**
   * Formulário reativo de curso.
   */
  readonly courseForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    coverImageUrl: [''],
    level: ['beginner' as 'beginner' | 'intermediate' | 'advanced', [Validators.required]],
    durationHours: [0, [Validators.required, Validators.min(1)]],
    status: ['draft' as 'draft' | 'published' | 'archived', [Validators.required]],
  });

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
        this.courseForm.patchValue({
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
      this.router.navigate(['/admin/courses']);
    }
  }

  /**
   * Manipula o submit do formulário.
   */
  protected async onSubmit(): Promise<void> {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.courseForm.value;
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

      this.router.navigate(['/admin/courses']);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
    }
  }

  /**
   * Cancela e volta para a lista.
   */
  protected cancel(): void {
    this.router.navigate(['/admin/courses']);
  }

  /**
   * Verifica se um campo tem erro.
   *
   * @param fieldName - Nome do campo
   * @returns true se o campo tem erro
   */
  protected hasError(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
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
    const field = this.courseForm.get(fieldName);

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
