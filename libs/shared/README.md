# @estuday/shared

Biblioteca compartilhada do EstuDay contendo componentes UI, modelos e utilitários reutilizáveis.

## Estrutura

```
src/
├── ui/          # Componentes UI reutilizáveis (Button, Card, etc.)
├── models/      # Interfaces e tipos TypeScript
├── util/        # Funções utilitárias e helpers
└── index.ts     # Exports principais
```

## Uso

### Importar componentes UI

```typescript
import { ButtonComponent, CardComponent } from '@estuday/shared';

@Component({
  imports: [ButtonComponent, CardComponent],
  // ...
})
export class MyComponent {}
```

### Importar modelos

```typescript
import { User, Course, PaginatedResponse } from '@estuday/shared';

const user: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Importar utilitários

```typescript
import { formatDateBR, capitalize, isValidEmail } from '@estuday/shared';

const formatted = formatDateBR(new Date());
const capitalized = capitalize('hello world');
const isValid = isValidEmail('user@example.com');
```

## Componentes UI

### ButtonComponent

Botão reutilizável com diferentes variantes e tamanhos.

```html
<app-button
  label="Clique aqui"
  variant="primary"
  size="md"
  [disabled]="false"
/>
```

**Props:**

- `label`: Texto do botão
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'

### CardComponent

Container para exibir conteúdo agrupado.

```html
<app-card>
  <h2>Título</h2>
  <p>Conteúdo do card</p>
</app-card>
```

## Modelos

### User

Modelo de dados para usuário do sistema.

### Course

Modelo de dados para curso.

### Common

Tipos comuns como `Result`, `LoadingState`, `Pagination`, etc.

## Utilitários

### Date Utils

- `formatDateBR(date)`: Formata data para DD/MM/YYYY
- `formatDateBRFull(date)`: Formata data completa
- `formatRelativeTime(date)`: Formata tempo relativo

### String Utils

- `capitalize(str)`: Capitaliza primeira letra
- `truncate(str, maxLength)`: Trunca string
- `removeAccents(str)`: Remove acentos
- `toSlug(str)`: Converte para slug

### Validation Utils

- `isValidEmail(email)`: Valida email
- `isValidUrl(url)`: Valida URL
- `isNotEmpty(str)`: Verifica se não está vazio
- `isInRange(value, min, max)`: Valida range numérico

### Array Utils

- `unique(array)`: Remove duplicatas
- `groupBy(array, keyFn)`: Agrupa por chave
- `sortBy(array, keyFn, direction)`: Ordena array

## Desenvolvimento

```bash
# Executar testes
nx test shared

# Executar lint
nx lint shared

# Build da biblioteca
nx build shared
```
