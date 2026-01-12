import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreateLesson, Lesson, UpdateLesson } from '@estuday/shared';
import {
  CoursesService,
  LessonsService,
  ModulesService,
} from '../../data-access';
import { BaseFormComponent } from '../../ui';

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
export class LessonFormComponent extends BaseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly lessonsService = inject(LessonsService);
  private readonly modulesService = inject(ModulesService);
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);

  /**
   * Formulário reativo de aula.
   */
  protected readonly form = this.fb.group({
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
    status: [
      'draft' as 'draft' | 'published' | 'archived',
      [Validators.required],
    ],
  });

  /**
   * Getter para compatibilidade com template.
   */
  get lessonForm(): FormGroup {
    return this.form;
  }

  /**
   * Rota para cancelamento.
   */
  protected get cancelRoute(): string[] {
    const courseId = this.courseId();
    const moduleId = this.moduleId();
    if (courseId && moduleId) {
      return ['/admin/courses', courseId, 'modules', moduleId, 'lessons'];
    }
    return ['/admin/courses'];
  }

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
    const courseId = this.route.snapshot.paramMap.get('courseId');
    const moduleId = this.route.snapshot.paramMap.get('moduleId');
    const lessonId = this.route.snapshot.paramMap.get('id');

    if (courseId && moduleId) {
      this.courseId.set(courseId);
      this.moduleId.set(moduleId);
    } else {
      this.router.navigate(['/admin/courses']);
      return;
    }

    if (lessonId) {
      // Modo de edição - carrega a aula
      this.loadLesson(courseId, moduleId, lessonId);
    }
    // Modo de criação - não precisa carregar nada
  }

  /**
   * Carrega a aula para edição.
   *
   * @param courseId - ID do curso
   * @param moduleId - ID do módulo
   * @param lessonId - ID da aula
   */
  async loadLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): Promise<void> {
    try {
      await this.coursesService.getCourseById(courseId);
      await this.modulesService.loadModulesByCourse(courseId);
      await this.modulesService.loadLessonsByModule(moduleId);

      const lessons = this.modulesService.getLessonsByModule(moduleId);
      const lessonToEdit = lessons.find((l) => l.id === lessonId);

      if (lessonToEdit) {
        this.lesson.set(lessonToEdit);
        this.form.patchValue({
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
      } else {
        this.router.navigate(this.cancelRoute);
      }
    } catch (error) {
      console.error('Erro ao carregar aula:', error);
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
          moduleId,
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

      this.router.navigate(this.cancelRoute);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
    }
  }

  /**
   * Verifica se o tipo de conteúdo requer URL.
   *
   * @returns true se precisa de URL
   */
  protected needsContentUrl(): boolean {
    const contentType = this.form.get('contentType')?.value as
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
    return (this.form.get('contentType')?.value as string | null) === 'text';
  }
}
