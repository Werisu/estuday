import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsService, ModulesService, CoursesService } from '../../data-access';
import { CreateLesson, Lesson, UpdateLesson } from '@estuday/shared';

/**
 * Componente de formulário de aula (criação e edição).
 */
@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lesson-form.component.html',
  styleUrl: './lesson-form.component.scss',
})
export class LessonFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly lessonsService = inject(LessonsService);
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Signal com a aula a ser editada (null para criação).
   */
  readonly lesson = signal<Lesson | null>(null);

  /**
   * Signal com o ID do módulo.
   */
  readonly moduleId = signal<string | null>(null);

  /**
   * Signal com o ID do curso.
   */
  readonly courseId = signal<string | null>(null);

  /**
   * Formulário reativo de aula.
   */
  readonly lessonForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    contentType: [
      'video' as 'video' | 'text' | 'quiz' | 'exercise' | 'document',
      [Validators.required],
    ],
    contentUrl: [''],
    textContent: [''],
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    order: [1, [Validators.required, Validators.min(1)]],
    isFree: [false],
    status: ['draft' as 'draft' | 'published' | 'archived', [Validators.required]],
  });

  /**
   * Indica se está processando.
   */
  readonly isProcessing = this.lessonsService.isLoading;

  /**
   * Indica se é modo de edição.
   */
  readonly isEditMode = computed(() => this.lesson() !== null);

  /**
   * Tipos de conteúdo disponíveis.
   */
  readonly contentTypes = [
    { value: 'video', label: 'Vídeo' },
    { value: 'text', label: 'Texto' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'exercise', label: 'Exercício' },
    { value: 'document', label: 'Documento' },
  ];

  ngOnInit(): void {
    const lessonToEdit = this.lesson();
    if (lessonToEdit) {
      this.lessonForm.patchValue({
        title: lessonToEdit.title,
        description: lessonToEdit.description,
        contentType: lessonToEdit.contentType,
        contentUrl: lessonToEdit.contentUrl || '',
        textContent: lessonToEdit.textContent || '',
        durationMinutes: lessonToEdit.durationMinutes,
        order: lessonToEdit.order,
        isFree: lessonToEdit.isFree,
        status: lessonToEdit.status,
      });
    }
  }

  /**
   * Manipula o submit do formulário.
   */
  protected async onSubmit(): Promise<void> {
    if (this.lessonForm.invalid) {
      this.lessonForm.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.lessonForm.value;
      const lessonToEdit = this.lesson();
      const moduleId = this.moduleId();
      const courseId = this.courseId();

      if (!moduleId || !courseId) {
        return;
      }

      if (lessonToEdit) {
        // Edição
        const updateData: UpdateLesson = {
          title: formValue.title!,
          description: formValue.description!,
          contentType: formValue.contentType!,
          contentUrl: formValue.contentUrl || undefined,
          textContent: formValue.textContent || undefined,
          durationMinutes: formValue.durationMinutes!,
          order: formValue.order!,
          isFree: formValue.isFree!,
          status: formValue.status!,
        };

        await this.lessonsService.updateLesson(lessonToEdit.id, updateData);
      } else {
        // Criação
        const createData: CreateLesson = {
          moduleId: moduleId,
          title: formValue.title!,
          description: formValue.description!,
          contentType: formValue.contentType!,
          contentUrl: formValue.contentUrl || undefined,
          textContent: formValue.textContent || undefined,
          durationMinutes: formValue.durationMinutes!,
          order: formValue.order!,
          isFree: formValue.isFree!,
          status: formValue.status!,
        };

        await this.lessonsService.createLesson(createData);
      }

      this.router.navigate([
        '/admin/courses',
        courseId,
        'modules',
        moduleId,
        'lessons',
      ]);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
    }
  }

  /**
   * Cancela e volta para a lista.
   */
  protected cancel(): void {
    const courseId = this.courseId();
    const moduleId = this.moduleId();
    if (courseId && moduleId) {
      this.router.navigate([
        '/admin/courses',
        courseId,
        'modules',
        moduleId,
        'lessons',
      ]);
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
    const field = this.lessonForm.get(fieldName);
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
    const field = this.lessonForm.get(fieldName);

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

  /**
   * Verifica se o tipo de conteúdo requer URL.
   *
   * @returns true se precisa de URL
   */
  protected needsContentUrl(): boolean {
    const contentType = this.lessonForm.get('contentType')?.value as
      | 'video'
      | 'text'
      | 'quiz'
      | 'exercise'
      | 'document'
      | null;
    return (
      contentType === 'video' ||
      contentType === 'document' ||
      contentType === 'quiz' ||
      contentType === 'exercise'
    );
  }

  /**
   * Verifica se o tipo de conteúdo requer texto.
   *
   * @returns true se precisa de texto
   */
  protected needsTextContent(): boolean {
    return (
      (this.lessonForm.get('contentType')?.value as string | null) === 'text'
    );
  }
}
