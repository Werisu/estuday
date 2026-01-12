# @estuday/courses

Biblioteca de cursos do EstuDay seguindo o padrão Nx com separação em data-access, features e ui.

## Estrutura

```
src/
├── data-access/        # CoursesService com Signals
├── ui/                 # Componentes UI reutilizáveis
├── feature-course-list/ # Feature de listagem
├── feature-course-detail/ # Feature de detalhe
└── index.ts           # Exports principais
```

## Uso

### CoursesService

O `CoursesService` utiliza Signals para gerenciar o estado de cursos:

```typescript
import { inject } from '@angular/core';
import { CoursesService } from '@estuday/courses';

@Component({...})
export class MyComponent {
  private readonly coursesService = inject(CoursesService);

  // Acessar estado
  readonly courses = this.coursesService.courses;
  readonly selectedCourse = this.coursesService.selectedCourse;
  readonly isLoading = this.coursesService.isLoading;
  readonly error = this.coursesService.error;

  // Carregar cursos
  async loadCourses() {
    await this.coursesService.loadCourses();
  }

  // Buscar curso por ID
  async getCourse(id: string) {
    await this.coursesService.getCourseById(id);
  }

  // Criar curso
  async createCourse(courseData: CreateCourse) {
    await this.coursesService.createCourse(courseData);
  }

  // Atualizar curso
  async updateCourse(id: string, courseData: UpdateCourse) {
    await this.coursesService.updateCourse(id, courseData);
  }

  // Remover curso
  async deleteCourse(id: string) {
    await this.coursesService.deleteCourse(id);
  }
}
```

### Componentes UI

#### CourseCardComponent

Card reutilizável para exibir um curso:

```typescript
import { CourseCardComponent } from '@estuday/courses';

@Component({
  imports: [CourseCardComponent],
  template: `
    <app-course-card
      [course]="course"
      [detailRoute]="'/custom-route'"
    />
  `,
})
export class MyComponent {
  course: Course = { ... };
}
```

### Features

#### CourseListComponent

Componente completo de listagem de cursos:

```typescript
import { CourseListComponent } from '@estuday/courses';

export const routes: Route[] = [
  {
    path: 'courses',
    loadComponent: () => CourseListComponent,
  },
];
```

**Funcionalidades:**

- Listagem de cursos em grid
- Busca por título/descrição
- Filtro por nível (beginner, intermediate, advanced)
- Estados de loading e erro
- Integração automática com CoursesService

#### CourseDetailComponent

Componente completo de detalhe do curso:

```typescript
import { CourseDetailComponent } from '@estuday/courses';

export const routes: Route[] = [
  {
    path: 'courses/:id',
    loadComponent: () => CourseDetailComponent,
  },
];
```

**Funcionalidades:**

- Exibição completa do curso
- Informações detalhadas
- Navegação de volta
- Estados de loading e erro
- Integração automática com CoursesService

## Preparação para Backend

O `CoursesService` está preparado para integração com backend:

1. **Métodos assíncronos**: Todos os métodos retornam `Promise`
2. **Estrutura de estado**: Estado centralizado com Signals
3. **Tratamento de erros**: Sistema de erros implementado
4. **Loading states**: Estados de carregamento gerenciados

**Para integrar com backend:**

```typescript
// Substituir métodos mockados por chamadas HTTP
async loadCourses(): Promise<Course[]> {
  // De: return this.getMockCourses();
  // Para:
  return this.http.get<Course[]>('/api/courses').toPromise();
}
```

## Características

- ✅ Signals para gerenciamento de estado
- ✅ Service mockado para desenvolvimento
- ✅ Preparado para integração com backend
- ✅ Componentes Standalone
- ✅ Código tipado e comentado
- ✅ Estados de loading e erro
- ✅ Filtros e busca
- ✅ Build funcionando

## Desenvolvimento

```bash
# Executar testes
nx test courses

# Executar lint
nx lint courses

# Build da biblioteca
nx build courses
```
