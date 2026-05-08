import { PrismaClient } from '@prisma/client'

export async function seedTypeScriptCourse(db: PrismaClient) {
  console.log('  Seeding TypeScript course...')

  const course = await db.course.upsert({
    where: { slug: 'typescript-basics' },
    update: {
      titleEn: 'TypeScript Fundamentals',
      titleRu: 'Основы TypeScript',
      descriptionEn: 'Learn TypeScript — typed JavaScript for large-scale apps.',
      descriptionRu: 'Изучи TypeScript — типизированный JavaScript для больших приложений.',
      isPublished: true,
    },
    create: {
      slug: 'typescript-basics',
      language: 'typescript',
      titleEn: 'TypeScript Fundamentals',
      titleRu: 'Основы TypeScript',
      descriptionEn: 'Learn TypeScript — typed JavaScript for large-scale apps.',
      descriptionRu: 'Изучи TypeScript — типизированный JavaScript для больших приложений.',
      level: 1,
      order: 7,
      isPublished: true,
      totalXP: 400,
    },
  })

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  async function upsertChapter(slug: string, order: number, titleEn: string, titleRu: string) {
    return db.chapter.upsert({
      where: { courseId_slug: { courseId: course.id, slug } },
      update: { titleEn, titleRu },
      create: { courseId: course.id, slug, order, titleEn, titleRu },
    })
  }

  async function theory(
    chapterId: string, slug: string, order: number, titleEn: string, titleRu: string,
    xpReward: number, contentEn: string, contentRu: string
  ) {
    return db.lesson.upsert({
      where: { chapterId_slug: { chapterId, slug } },
      update: { contentEn, contentRu, titleEn, titleRu },
      create: {
        chapterId, slug, type: 'theory', order, titleEn, titleRu,
        contentEn, contentRu, xpReward, isPublished: true, estimatedMin: 8,
      },
    })
  }

  async function exercise(
    chapterId: string, slug: string, order: number, titleEn: string, titleRu: string,
    xpReward: number, contentEn: string, contentRu: string,
    instructionsEn: string, instructionsRu: string,
    starterCode: string, solutionCode: string,
    testCases: object[], hints: object[]
  ) {
    const lesson = await db.lesson.upsert({
      where: { chapterId_slug: { chapterId, slug } },
      update: { contentEn, contentRu, titleEn, titleRu },
      create: {
        chapterId, slug, type: 'exercise', order, titleEn, titleRu,
        contentEn, contentRu, xpReward, isPublished: true, estimatedMin: 15,
      },
    })
    await db.exercise.upsert({
      where: { lessonId: lesson.id },
      update: { instructionsEn, instructionsRu, starterCode, solutionCode, hints },
      create: {
        lessonId: lesson.id, instructionsEn, instructionsRu,
        starterCode, solutionCode, language: 'typescript',
        timeoutMs: 10000, testCases, hints,
      },
    })
    return lesson
  }

  // ─── Chapter 1: Introduction ──────────────────────────────────────────────────

  const ch1 = await upsertChapter('ts-intro', 1, 'Introduction to TypeScript', 'Введение в TypeScript')

  await theory(ch1.id, 'ts-what-is', 1, 'What is TypeScript?', 'Что такое TypeScript?', 10, `
# What is TypeScript?

TypeScript is JavaScript with **static types** — created by Microsoft to catch bugs before your code runs.

\`\`\`typescript
// JavaScript — error only appears at runtime
let name = "Alice"
name = 42  // works in JS, bug discovered only when code runs

// TypeScript — error caught immediately by the compiler
let name: string = "Alice"
name = 42  // ❌ Error: Type 'number' is not assignable to type 'string'
\`\`\`

## Why TypeScript?
- **Catches bugs early** — at compile time, not in production
- **Better autocomplete** — your editor knows what properties exist
- **Self-documenting** — types are readable documentation
- **Industry standard** — React, Angular, Node.js all use it

TypeScript compiles to plain JavaScript — browsers don't run TypeScript directly.
  `.trim(), `
# Что такое TypeScript?

TypeScript — это JavaScript с **типами**. Создан Microsoft чтобы ловить ошибки ещё до запуска кода.

## JavaScript vs TypeScript

\`\`\`javascript
// JavaScript — ошибка проявится только при запуске
let name = "Алиса"
name = 42  // JS молча разрешит, ошибка обнаружится позже
\`\`\`

\`\`\`typescript
// TypeScript — ошибка видна сразу в редакторе
let name: string = "Алиса"
name = 42  // ❌ Ошибка: нельзя присвоить number туда где ожидается string
\`\`\`

## Зачем он нужен?

Представь, что ты строишь дом. JavaScript — это когда ты кладёшь кирпичи без чертежей: быстро, но потом может рухнуть стена. TypeScript — это чертежи: дольше рисовать, зато ошибки видны до стройки.

- **Ловит баги заранее** — не в продакшене, а пока пишешь код
- **Автодополнение** — редактор знает что у объекта есть и предлагает варианты
- **Читаемый код** — типы сами по себе документация
- **Стандарт индустрии** — React, Angular, NestJS, почти весь современный JS

TypeScript компилируется в обычный JavaScript — браузеры его не запускают напрямую.
  `.trim())

  await theory(ch1.id, 'ts-basic-types', 2, 'Basic Types', 'Базовые типы', 10, `
# Basic Types in TypeScript

TypeScript has primitive types that map directly to JavaScript:

\`\`\`typescript
// Primitives
let name: string = "Alice"
let age: number = 25
let isStudent: boolean = true

// TypeScript can also INFER types — you don't always need to write them
let city = "Moscow"  // TypeScript knows this is string
let score = 100      // TypeScript knows this is number

// Arrays
let scores: number[] = [85, 92, 78]
let names: string[] = ["Alice", "Bob"]

// Tuple — fixed-length array with specific types
let point: [number, number] = [10, 20]

// Union types — can be one of several types
let id: string | number = "user_123"
id = 42  // also valid
\`\`\`

## Special types

\`\`\`typescript
// any — opts out of type checking (avoid when possible)
let data: any = "hello"
data = 42  // no error

// void — for functions that return nothing
function log(msg: string): void {
  console.log(msg)
}

// null and undefined
let nothing: null = null
let undef: undefined = undefined
\`\`\`
  `.trim(), `
# Базовые типы в TypeScript

## Примитивы

\`\`\`typescript
let name: string = "Алиса"    // строка
let age: number = 25           // число (целые и дробные — один тип)
let isStudent: boolean = true  // булево
\`\`\`

Запись \`let name: string\` читается как "переменная name типа string". Двоеточие — это знак типа.

## Вывод типов (Type Inference)

TypeScript умный — часто можно не писать тип, он догадается сам:

\`\`\`typescript
let city = "Москва"   // TypeScript сам понял: string
let score = 100        // TypeScript сам понял: number

city = 42  // ❌ Ошибка — TypeScript помнит что это string
\`\`\`

## Массивы

\`\`\`typescript
let scores: number[] = [85, 92, 78]  // массив чисел
let names: string[] = ["Алиса", "Боб"]  // массив строк
\`\`\`

## Union types — несколько вариантов типа

\`\`\`typescript
let id: string | number = "user_123"
id = 42  // тоже допустимо — id может быть и строкой и числом
\`\`\`

Вертикальная черта \`|\` читается как "или": строка или число.

## any — отключение проверки типов

\`\`\`typescript
let data: any = "привет"
data = 42  // TypeScript не будет жаловаться
\`\`\`

\`any\` — это "спасательный люк". Используй только когда без него не обойтись, иначе теряется смысл TypeScript.
  `.trim())

  await exercise(
    ch1.id, 'ts-types-exercise', 3,
    'Typing Variables', 'Типизация переменных', 25,
    '# Typing Variables\n\nDeclare typed variables `username` (string), `score` (number), `isActive` (boolean) and print them.',
    `# Типизация переменных

Объяви три типизированные переменные и выведи их через \`console.log()\`.

Назови переменные именно так:
- \`username: string\` — любое имя
- \`score: number\` — любое число
- \`isActive: boolean\` — true или false

Синтаксис типизации:
\`\`\`typescript
let username: string = "Алиса"
\`\`\``,
    'Declare username, score, isActive with types and print them',
    'Объяви username, score, isActive с типами — любые значения — и выведи через console.log()',
    `// Объяви типизированные переменные (любые значения):
let username: string = ""
let score: number = 0
let isActive: boolean = true

// Выведи каждую через console.log():
`,
    `let username: string = "Alice"
let score: number = 1500
let isActive: boolean = true
console.log(username)
console.log(score)
console.log(isActive)`,
    [{ input: '', expectedOutput: '', matchType: 'non_empty', isHidden: false }],
    [
      { order: 1, textEn: 'let username: string = "Alice" — type after colon', textRu: 'let username: string = "Алиса" — тип пишется после двоеточия, перед знаком равно' },
      { order: 2, textEn: 'Use console.log() for each variable', textRu: 'console.log(username) — по одному вызову на каждую переменную' },
    ]
  )

  // ─── Chapter 2: Functions ─────────────────────────────────────────────────────

  const ch2 = await upsertChapter('ts-functions', 2, 'Functions with Types', 'Функции с типами')

  await theory(ch2.id, 'ts-function-types', 1, 'Typed Functions', 'Типизация функций', 10, `
# Typed Functions

In TypeScript you annotate parameter types and the return type:

\`\`\`typescript
// Parameters typed, return type after ):
function greet(name: string): string {
  return "Hello, " + name
}

// Arrow function
const add = (a: number, b: number): number => a + b

// void — returns nothing
function log(msg: string): void {
  console.log(msg)
}
\`\`\`

## Optional and default parameters

\`\`\`typescript
// Optional parameter with ?
function greet(name: string, title?: string): string {
  return title ? \`Hello, \${title} \${name}\` : \`Hello, \${name}\`
}
greet("Alice")          // "Hello, Alice"
greet("Alice", "Dr.")   // "Hello, Dr. Alice"

// Default value
function repeat(text: string, times: number = 3): string {
  return text.repeat(times)
}
repeat("ha")     // "hahaha"
repeat("ha", 2)  // "haha"
\`\`\`
  `.trim(), `
# Типизация функций

Для функций указываются типы параметров и тип возвращаемого значения:

\`\`\`typescript
function greet(name: string): string {
  return "Привет, " + name
}
\`\`\`

Читается так: функция \`greet\` принимает \`name\` типа \`string\` и **возвращает** \`string\`.

## Стрелочные функции

\`\`\`typescript
const add = (a: number, b: number): number => a + b
\`\`\`

То же самое, только короче. Тип возвращаемого значения — после закрывающей скобки перед \`=>\`.

## Опциональные параметры

\`\`\`typescript
function greet(name: string, title?: string): string {
  return title ? \`Привет, \${title} \${name}\` : \`Привет, \${name}\`
}

greet("Алиса")           // "Привет, Алиса"
greet("Алиса", "Др.")    // "Привет, Др. Алиса"
\`\`\`

Знак \`?\` после имени параметра означает "этот параметр необязательный". Если его не передать — будет \`undefined\`.

## Значения по умолчанию

\`\`\`typescript
function repeat(text: string, times: number = 3): string {
  return text.repeat(times)
}

repeat("ха")     // "хахаха" — times = 3 по умолчанию
repeat("ха", 2)  // "хаха"
\`\`\`

Отличие от \`?\`: у параметра со значением по умолчанию есть запасное значение, а не просто "может быть undefined".
  `.trim())

  await exercise(
    ch2.id, 'ts-function-exercise', 2,
    'Write a Typed Function', 'Напиши типизированную функцию', 25,
    '# Write a Typed Function\n\nWrite function `fullName(first: string, last: string): string` that returns the full name.',
    `# Напиши типизированную функцию

Напиши функцию \`fullName\`, которая принимает имя и фамилию и возвращает полное имя.

Сигнатура функции:
\`\`\`typescript
function fullName(first: string, last: string): string
\`\`\`

Пример использования:
\`\`\`typescript
console.log(fullName("Алиса", "Иванова"))  // "Алиса Иванова"
\`\`\``,
    'Write fullName(first, last) that returns first + " " + last',
    'Напиши fullName(first, last) которая возвращает полное имя через пробел',
    `function fullName(first: string, last: string): string {
  // напиши тело функции
  return ""
}

console.log(fullName("Alice", "Johnson"))
console.log(fullName("Алиса", "Иванова"))`,
    `function fullName(first: string, last: string): string {
  return first + " " + last
}

console.log(fullName("Alice", "Johnson"))
console.log(fullName("Алиса", "Иванова"))`,
    [
      { input: '', expectedOutput: 'Alice Johnson\nАлиса Иванова', isHidden: false },
    ],
    [
      { order: 1, textEn: 'Return first + " " + last inside the function body', textRu: 'Внутри функции напиши: return first + " " + last — пробел в кавычках соединяет имя и фамилию' },
      { order: 2, textEn: 'Or use a template literal: return `${first} ${last}`', textRu: 'Или через шаблонную строку: return `${first} ${last}` — результат тот же, синтаксис чище' },
    ]
  )

  // ─── Chapter 3: Interfaces & Objects ─────────────────────────────────────────

  const ch3 = await upsertChapter('ts-interfaces', 3, 'Interfaces & Objects', 'Интерфейсы и объекты')

  await theory(ch3.id, 'ts-interfaces-theory', 1, 'Interfaces', 'Интерфейсы', 10, `
# Interfaces

An **interface** defines the shape of an object — what properties it must have:

\`\`\`typescript
interface User {
  name: string
  age: number
  email?: string  // optional
}

const user: User = {
  name: "Alice",
  age: 25,
}

// This would be an error:
const bad: User = {
  name: "Bob",
  // ❌ Missing 'age' — TypeScript will complain
}
\`\`\`

## Interfaces for functions

\`\`\`typescript
interface Greeter {
  (name: string): string
}

const greet: Greeter = (name) => \`Hello, \${name}!\`
\`\`\`

## Extending interfaces

\`\`\`typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

const dog: Dog = { name: "Rex", breed: "Labrador" }
\`\`\`
  `.trim(), `
# Интерфейсы

Интерфейс описывает **форму объекта** — какие поля у него должны быть и каких типов.

\`\`\`typescript
interface User {
  name: string
  age: number
  email?: string  // необязательное поле
}
\`\`\`

Думай об интерфейсе как о договоре: "каждый объект типа User обязан иметь name и age".

## Использование интерфейса

\`\`\`typescript
const user: User = {
  name: "Алиса",
  age: 25,
  // email можно не указывать — оно необязательное
}

const bad: User = {
  name: "Боб",
  // ❌ Ошибка: пропущено обязательное поле age
}
\`\`\`

## Наследование интерфейсов

\`\`\`typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

const dog: Dog = { name: "Рекс", breed: "Лабрадор" }
// Dog должен иметь и name (от Animal) и breed (своё)
\`\`\`

Ключевое слово \`extends\` — "взять всё из Animal и добавить своё".

## Зачем интерфейсы?

Без интерфейсов сложно понять что должно быть внутри объекта. Интерфейс — это как "паспорт объекта": смотришь на него и сразу знаешь что там есть.
  `.trim())

  await exercise(
    ch3.id, 'ts-interface-exercise', 2,
    'Create an Interface', 'Создай интерфейс', 25,
    '# Create an Interface\n\nDefine a `Product` interface with `name: string`, `price: number`, `inStock: boolean` and create an object.',
    `# Создай интерфейс

Определи интерфейс \`Product\` с полями:
- \`name: string\` — название товара
- \`price: number\` — цена
- \`inStock: boolean\` — есть ли в наличии

Затем создай объект \`product\` типа \`Product\` с любыми значениями и выведи его поля.`,
    'Define Product interface and create a product object, print its fields',
    'Определи интерфейс Product и создай объект, выведи поля через console.log()',
    `interface Product {
  // заполни поля интерфейса
}

const product: Product = {
  // заполни объект
}

console.log(product.name)
console.log(product.price)
console.log(product.inStock)`,
    `interface Product {
  name: string
  price: number
  inStock: boolean
}

const product: Product = {
  name: "Laptop",
  price: 999,
  inStock: true,
}

console.log(product.name)
console.log(product.price)
console.log(product.inStock)`,
    [{ input: '', expectedOutput: '', matchType: 'non_empty', isHidden: false }],
    [
      { order: 1, textEn: 'Interface fields: name: string on separate lines inside {}', textRu: 'Поля интерфейса: name: string — каждое поле на отдельной строке внутри {}' },
      { order: 2, textEn: 'Object must match the interface exactly: name, price, inStock', textRu: 'Объект должен содержать все три поля: name, price, inStock — иначе TypeScript выдаст ошибку' },
    ]
  )

  // ─── Chapter 4: Generics ──────────────────────────────────────────────────────

  const ch4 = await upsertChapter('ts-generics', 4, 'Generics', 'Дженерики')

  await theory(ch4.id, 'ts-generics-theory', 1, 'Generics', 'Дженерики', 10, `
# Generics

Generics let you write **reusable code** that works with multiple types while keeping type safety:

\`\`\`typescript
// Without generics — loses type info
function first(arr: any[]): any {
  return arr[0]
}

// With generics — type is preserved
function first<T>(arr: T[]): T {
  return arr[0]
}

const num = first([1, 2, 3])        // TypeScript knows: num is number
const str = first(["a", "b", "c"]) // TypeScript knows: str is string
\`\`\`

## Generic interfaces

\`\`\`typescript
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

type UserResponse = ApiResponse<User>
// { data: User; status: number; message: string }
\`\`\`

## Built-in generics

\`\`\`typescript
const names: Array<string> = ["Alice", "Bob"]  // same as string[]
const map = new Map<string, number>()
map.set("score", 100)
\`\`\`
  `.trim(), `
# Дженерики

Дженерики — это "переменные для типов". Позволяют писать функции и классы которые работают с **любым типом**, но при этом сохраняют типобезопасность.

## Проблема без дженериков

\`\`\`typescript
function first(arr: any[]): any {
  return arr[0]
}

const result = first([1, 2, 3])
// TypeScript не знает что result — это number
// result.toFixed(2) — не будет подсказки
\`\`\`

## Решение с дженериками

\`\`\`typescript
function first<T>(arr: T[]): T {
  return arr[0]
}
\`\`\`

\`T\` — это "заглушка" для типа. При вызове TypeScript подставляет нужный тип:

\`\`\`typescript
const num = first([1, 2, 3])         // T = number, num: number
const str = first(["a", "b", "c"])  // T = string, str: string
\`\`\`

Теперь редактор знает что \`num\` — это число и предлагает \`.toFixed()\`, а \`str\` — строку с \`.toUpperCase()\`.

## Дженерик-интерфейсы

\`\`\`typescript
interface ApiResponse<T> {
  data: T        // тип данных зависит от T
  status: number
  ok: boolean
}

// Ответ с пользователем:
type UserResponse = ApiResponse<User>
// { data: User; status: number; ok: boolean }

// Ответ со списком:
type ListResponse = ApiResponse<string[]>
// { data: string[]; status: number; ok: boolean }
\`\`\`

Дженерики широко используются в React (\`useState<User>\`), API-клиентах, утилитах.
  `.trim())

  await exercise(
    ch4.id, 'ts-generics-exercise', 2,
    'Write a Generic Function', 'Напиши дженерик-функцию', 25,
    '# Write a Generic Function\n\nWrite generic function `identity<T>(value: T): T` that returns the same value it receives.',
    `# Напиши дженерик-функцию

Напиши функцию \`identity\` которая возвращает то что получает, сохраняя тип.

Сигнатура:
\`\`\`typescript
function identity<T>(value: T): T
\`\`\`

Пример:
\`\`\`typescript
identity(42)       // вернёт 42 (number)
identity("hello")  // вернёт "hello" (string)
identity(true)     // вернёт true (boolean)
\`\`\``,
    'Write identity<T>(value: T): T and call it with number, string, boolean',
    'Напиши identity<T>(value: T): T и вызови с числом, строкой и булевым',
    `function identity<T>(value: T): T {
  // верни value
  return value
}

console.log(identity(42))
console.log(identity("hello"))
console.log(identity(true))`,
    `function identity<T>(value: T): T {
  return value
}

console.log(identity(42))
console.log(identity("hello"))
console.log(identity(true))`,
    [
      { input: '', expectedOutput: '42\nhello\ntrue', isHidden: false },
    ],
    [
      { order: 1, textEn: 'The function body is just: return value', textRu: 'Тело функции: return value — просто возвращаем что получили, тип сохранится автоматически' },
      { order: 2, textEn: '<T> is declared after the function name, then used in parameters and return type', textRu: '<T> пишется после имени функции, потом используется в параметре и возвращаемом типе: identity<T>(value: T): T' },
    ]
  )

  console.log('  ✓ TypeScript course seeded')
}
