import { PrismaClient } from '@prisma/client'

export async function seedGoCourse(db: PrismaClient) {
  console.log('  Seeding Go course...')

  const course = await db.course.upsert({
    where: { slug: 'go-fundamentals' },
    update: {},
    create: {
      slug: 'go-fundamentals',
      language: 'go',
      titleEn: 'Go Fundamentals',
      titleRu: 'Основы Go',
      descriptionEn: 'Learn Go — the language behind Docker, Kubernetes, and modern cloud infrastructure. Clean syntax, lightning-fast compilation, and built-in concurrency.',
      descriptionRu: 'Изучите Go — язык, на котором написаны Docker, Kubernetes и современная облачная инфраструктура. Чистый синтаксис, быстрая компиляция и встроенный параллелизм.',
      level: 1,
      totalXP: 320,
      isPublished: true,
    },
  })

  // ─── Chapter 1 ────────────────────────────────────────────────────────────
  const ch1 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'getting-started-go' } },
    update: {},
    create: { courseId: course.id, slug: 'getting-started-go', order: 1, titleEn: 'Getting Started with Go', titleRu: 'Начало работы с Go' },
  })

  await lesson(db, ch1.id, {
    slug: 'what-is-go', order: 1, type: 'theory', xpReward: 10,
    titleEn: 'What is Go?', titleRu: 'Что такое Go?',
    contentEn: `# What is Go?

Go (Golang) is an open-source language created by Google in 2009. Designed to be **simple, fast, and reliable**.

## Why Go?

- **Fast compilation**: compiles to native machine code in seconds
- **Garbage collected**: no manual memory management
- **Statically typed**: bugs caught at compile time
- **Built-in concurrency**: goroutines make parallel code easy
- **Used by**: Docker, Kubernetes, Terraform, GitHub CLI

## Hello, Go!

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`

Every Go program starts with a **package declaration**. The \`main\` package defines an executable. The \`main()\` function is the entry point.

## Go vs Python

| Feature | Go | Python |
|---------|-----|--------|
| Compilation | Native binary | Interpreted |
| Speed | Very fast | Slower |
| Typing | Static (strict) | Dynamic (flexible) |
| Concurrency | Built-in goroutines | Limited (GIL) |`,
    contentRu: `# Что такое Go?

Go (Golang) — язык программирования, созданный Google в 2009 году. Его используют в Docker, Kubernetes, GitHub CLI.

## Зачем Go, если есть Python?

Python — как разговорный язык. Говоришь — тебя сразу понимают. Удобно, но иногда медленно.

Go — как инструкция к технике. Чуть больше формальностей, зато работает в разы быстрее и никогда не теряется в многозадачности.

## Привет, Go! Разбираем по частям

В Python достаточно написать одну строку:
\`\`\`python
print("Привет!")
\`\`\`

В Go то же самое выглядит так:
\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Привет!")
}
\`\`\`

Давайте разберём каждую строчку по-человечески:

**\`package main\`** — это как "название отдела" в организации. Говорит Go: "Эта программа — главная, её можно запустить напрямую". Всегда пишем это в начале.

**\`import "fmt"\`** — берём с полки нужный инструмент. \`fmt\` — это коробка с инструментами для вывода текста на экран. Без этой строки \`Println\` работать не будет.

**\`func main() { ... }\`** — главная инструкция программы. Всё что внутри фигурных скобок \`{}\` — выполнится при запуске. В Python такой специальной функции нет — код запускается сверху вниз сам по себе. В Go всегда нужна \`main()\`.

**\`fmt.Println("Привет!")\`** — выводим текст. \`fmt\` — коробка, \`Println\` — инструмент внутри неё. Точка означает "возьми из коробки \`fmt\` инструмент \`Println\`".`,
  })

  await exercise(db, ch1.id, {
    slug: 'go-hello', order: 2, xpReward: 20,
    titleEn: 'Your First Go Program', titleRu: 'Ваша первая программа на Go',
    contentEn: '# Your First Go Program\n\nWrite a Go program that prints **"Hello, Go!"** to the console.\n\nUse `fmt.Println()` inside the `main()` function.',
    contentRu: `# Первая программа на Go

Напишите программу, которая выводит **"Hello, Go!"** на экран.

Структура уже готова — вам нужно добавить только одну строку внутри \`func main()\`.

В Python вы написали бы:
\`\`\`python
print("Hello, Go!")
\`\`\`

В Go это будет:
\`\`\`go
fmt.Println("Hello, Go!")
\`\`\`

Добавьте эту строку вместо комментария.`,
    instructionsEn: 'Print "Hello, Go!" using fmt.Println()',
    instructionsRu: 'Выведите "Hello, Go!" с помощью fmt.Println()',
    starterCode: `package main

import "fmt"

func main() {
    // Напишите здесь: fmt.Println("Hello, Go!")
}`,
    solutionCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}`,
    testCases: [{ input: '', expectedOutput: 'Hello, Go!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use fmt.Println() to print text', textRu: 'Напишите: fmt.Println("Hello, Go!") — заглавные буквы важны!' },
      { order: 2, textEn: 'fmt.Println("Hello, Go!") prints the text with a newline', textRu: 'Текст внутри кавычек должен совпадать точно: Hello, Go! (с запятой и восклицательным знаком)' },
    ],
  })

  // ─── Chapter 2 ────────────────────────────────────────────────────────────
  const ch2 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'go-variables-types' } },
    update: {},
    create: { courseId: course.id, slug: 'go-variables-types', order: 2, titleEn: 'Variables and Types', titleRu: 'Переменные и типы' },
  })

  await lesson(db, ch2.id, {
    slug: 'go-variables-theory', order: 1, type: 'theory', xpReward: 10,
    titleEn: 'Variables in Go', titleRu: 'Переменные в Go',
    contentEn: `# Variables in Go

Go is statically typed — every variable has a known type at compile time.

## Declaring Variables

\`\`\`go
var name string = "Alice"
var age  int    = 30
\`\`\`

### Short declaration (most common)
\`\`\`go
name    := "Alice"   // string
age     := 30        // int
pi      := 3.14      // float64
active  := true      // bool
\`\`\`

## Basic Types

| Type | Example | Python equivalent |
|------|---------|-------------------|
| \`int\` | \`42\` | \`int\` |
| \`float64\` | \`3.14\` | \`float\` |
| \`string\` | \`"hello"\` | \`str\` |
| \`bool\` | \`true\` | \`bool\` |

## Constants

\`\`\`go
const Pi = 3.14159
const MaxUsers = 1000
\`\`\`

## Zero Values

Uninitialized variables get zero values:
\`int\` → \`0\`, \`float64\` → \`0.0\`, \`string\` → \`""\`, \`bool\` → \`false\``,
    contentRu: `# Переменные в Go

## Переменная — это именованная коробка

Представьте переменную как коробку с подписью. Вы кладёте туда значение и обращаетесь к нему по имени.

В Python:
\`\`\`python
name = "Дима"
age  = 25
\`\`\`

В Go почти то же самое, только с \`:=\` при первом создании:
\`\`\`go
name := "Дима"
age  := 25
\`\`\`

**Почему \`:=\` а не \`=\`?**
Знак \`:=\` означает "создай новую коробку и сразу положи туда значение". Когда нужно просто изменить уже существующую — пишем обычное \`=\`:
\`\`\`go
name := "Дима"   // создаём первый раз
name = "Саша"    // меняем потом
\`\`\`

## Типы: Go хочет знать что в коробке

Python не требует уточнять тип — сам догадывается. Go тоже обычно догадывается (через \`:=\`), но иногда нужно сказать явно:

\`\`\`go
var name string = "Дима"   // явно: это текст
var age  int    = 25        // явно: это целое число
var pi   float64 = 3.14    // явно: дробное число
\`\`\`

| Тип в Go | Что это | Аналог в Python |
|----------|---------|-----------------|
| \`string\` | Текст | \`str\` |
| \`int\` | Целое число | \`int\` |
| \`float64\` | Дробное число | \`float\` |
| \`bool\` | Да/Нет | \`bool\` |

## Константы — коробки которые нельзя изменить

\`\`\`go
const MaxScore = 100
const AppName = "CodeNexus"
\`\`\`

В Python аналог — переменная написанная ЗАГЛАВНЫМИ буквами (по договорённости). В Go \`const\` — это гарантия: попытка изменить вызовет ошибку.

## Нулевые значения — Go не любит пустоту

Если создали переменную, но ничего не положили — Go автоматически кладёт "ноль" для этого типа:
- Число \`int\` → \`0\`
- Текст \`string\` → \`""\` (пустая строка)
- Логика \`bool\` → \`false\``,
  })

  await exercise(db, ch2.id, {
    slug: 'go-variables-exercise', order: 2, xpReward: 25,
    titleEn: 'Working with Variables', titleRu: 'Работа с переменными',
    contentEn: '# Working with Variables\n\nDeclare variables `name` (string), `year` (int), `version` (float64) with **your own values** and print each on a separate line using `fmt.Println()`.',
    contentRu: `# Работа с переменными

Объяви три переменные с **любыми значениями** и выведи каждую на отдельной строке.

Назови переменные именно так:
- \`name\` — строка (твоё имя или что угодно)
- \`year\` — целое число (год, любой)
- \`version\` — дробное число (версия, любая)

Для объявления в Go используй \`:=\` (двоеточие + равно). Для вывода — \`fmt.Println()\`.

Пример:
\`\`\`go
name    := "Алексей"
year    := 2025
version := 1.5
fmt.Println(name)
fmt.Println(year)
fmt.Println(version)
\`\`\``,
    instructionsEn: 'Declare name, year, version with your own values and print each using fmt.Println()',
    instructionsRu: 'Объяви name, year, version — любые значения — и выведи каждую через fmt.Println()',
    starterCode: `package main

import "fmt"

func main() {
    // Объяви три переменные (любые значения):
    name    :=
    year    :=
    version :=

    // Выведи каждую через fmt.Println():

}`,
    solutionCode: `package main

import "fmt"

func main() {
    name    := "Go Developer"
    year    := 2024
    version := 1.22
    fmt.Println(name)
    fmt.Println(year)
    fmt.Println(version)
}`,
    testCases: [{ input: '', expectedOutput: '', matchType: 'non_empty', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use := to declare: name := "Alice"', textRu: 'name := "Алексей" — двоеточие перед равно обязательно, это Go-синтаксис для первого объявления переменной' },
      { order: 2, textEn: 'Use fmt.Println() for each variable on its own line', textRu: 'Три отдельных fmt.Println() — один на каждую переменную. fmt — пакет форматирования, Println — вывод с переносом строки' },
    ],
  })

  // ─── Chapter 3 ────────────────────────────────────────────────────────────
  const ch3 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'go-control-flow' } },
    update: {},
    create: { courseId: course.id, slug: 'go-control-flow', order: 3, titleEn: 'Control Flow', titleRu: 'Управление потоком' },
  })

  await lesson(db, ch3.id, {
    slug: 'go-control-flow-theory', order: 1, type: 'theory', xpReward: 10,
    titleEn: 'If, For, and Switch', titleRu: 'If, For и Switch',
    contentEn: `# Control Flow in Go

## If / Else

\`\`\`go
age := 18
if age >= 18 {
    fmt.Println("Adult")
} else if age >= 13 {
    fmt.Println("Teenager")
} else {
    fmt.Println("Child")
}
\`\`\`

Go doesn't use parentheses around conditions, but **always requires** curly braces.

## For Loop (the only loop keyword in Go)

\`\`\`go
// Classic
for i := 0; i < 5; i++ { fmt.Println(i) }

// While-style
n := 1
for n < 100 { n *= 2 }
\`\`\`

## Switch

\`\`\`go
day := "Monday"
switch day {
case "Saturday", "Sunday":
    fmt.Println("Weekend")
default:
    fmt.Println("Weekday")
}
\`\`\`
No need for \`break\` — Go doesn't fall through by default.`,
    contentRu: `# Управление потоком — решения и повторения

## If / Else — принимаем решения

В Python:
\`\`\`python
age = 18
if age >= 18:
    print("Взрослый")
elif age >= 13:
    print("Подросток")
else:
    print("Ребёнок")
\`\`\`

В Go то же самое, только:
- Вместо двоеточия \`:\` — открывающая скобка \`{\`
- Вместо отступов — скобки \`{ }\` вокруг каждого блока
- \`elif\` пишется как \`else if\`

\`\`\`go
age := 18
if age >= 18 {
    fmt.Println("Взрослый")
} else if age >= 13 {
    fmt.Println("Подросток")
} else {
    fmt.Println("Ребёнок")
}
\`\`\`

**Важно**: скобок вокруг условия нет — \`if age >= 18 {...}\`, не \`if (age >= 18) {...}\`.

## For — единственный цикл в Go

В Python есть \`for\` и \`while\`. В Go — только \`for\`, но он умеет быть обоими.

**Классический (как \`for\` в Python с range):**
\`\`\`go
// Go
for i := 0; i < 5; i++ {
    fmt.Println(i)  // выведет 0, 1, 2, 3, 4
}
\`\`\`
\`\`\`python
# Python аналог
for i in range(5):
    print(i)
\`\`\`

Три части через точку с запятой: **начало** ; **условие продолжения** ; **шаг**

**В стиле while:**
\`\`\`go
n := 1
for n < 100 {
    n *= 2   // удваиваем пока не превысим 100
}
\`\`\`
\`\`\`python
# Python аналог
n = 1
while n < 100:
    n *= 2
\`\`\`

## Switch — выбор из вариантов

Это как длинная цепочка \`if/elif\` но красивее. Аналог \`match/case\` в Python 3.10+.

\`\`\`go
day := "Понедельник"
switch day {
case "Суббота", "Воскресенье":
    fmt.Println("Выходной")
case "Пятница":
    fmt.Println("Почти выходной!")
default:
    fmt.Println("Рабочий день")
}
\`\`\`

\`break\` писать не нужно — Go сам останавливается после найденного варианта.`,
  })

  await exercise(db, ch3.id, {
    slug: 'go-fizzbuzz', order: 2, xpReward: 30,
    titleEn: 'FizzBuzz in Go', titleRu: 'FizzBuzz на Go',
    contentEn: '# FizzBuzz in Go\n\nPrint numbers 1–20. For multiples of 3 print `Fizz`, multiples of 5 print `Buzz`, both print `FizzBuzz`.',
    contentRu: `# FizzBuzz на Go

Выведите числа от 1 до 20, но:
- Если число делится на 3 — вместо числа напишите \`Fizz\`
- Если делится на 5 — напишите \`Buzz\`
- Если делится и на 3, и на 5 — напишите \`FizzBuzz\`

В Python:
\`\`\`python
for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
\`\`\`

В Go структура for-цикла уже написана — вам нужно добавить логику внутри.

**Знак \`%\`** — остаток от деления. Если \`i % 3 == 0\`, значит число делится на 3 без остатка.`,
    instructionsEn: 'Use a for loop and if/else to implement FizzBuzz for 1-20',
    instructionsRu: 'Добавьте if/else внутри цикла — проверяйте сначала делимость на 15, потом на 3, потом на 5',
    starterCode: `package main

import "fmt"

func main() {
    for i := 1; i <= 20; i++ {
        // Ваша логика FizzBuzz здесь
        // Подсказка: сначала проверьте i%15 == 0
    }
}`,
    solutionCode: `package main

import "fmt"

func main() {
    for i := 1; i <= 20; i++ {
        if i%15 == 0 {
            fmt.Println("FizzBuzz")
        } else if i%3 == 0 {
            fmt.Println("Fizz")
        } else if i%5 == 0 {
            fmt.Println("Buzz")
        } else {
            fmt.Println(i)
        }
    }
}`,
    testCases: [{ input: '', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Check i%15 == 0 first (divisible by both)', textRu: 'Сначала проверяйте i%15 == 0 — иначе FizzBuzz никогда не выведется' },
      { order: 2, textEn: 'Use fmt.Println(i) for numbers, fmt.Println("Fizz") for Fizz', textRu: 'Числа: fmt.Println(i) без кавычек. Текст: fmt.Println("Fizz") в кавычках' },
    ],
  })

  // ─── Chapter 4 ────────────────────────────────────────────────────────────
  const ch4 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'go-functions' } },
    update: {},
    create: { courseId: course.id, slug: 'go-functions', order: 4, titleEn: 'Functions', titleRu: 'Функции' },
  })

  await lesson(db, ch4.id, {
    slug: 'go-functions-theory', order: 1, type: 'theory', xpReward: 10,
    titleEn: 'Functions in Go', titleRu: 'Функции в Go',
    contentEn: `# Functions in Go

\`\`\`go
func greet(name string) string {
    return "Hello, " + name + "!"
}
\`\`\`

## Multiple Return Values

\`\`\`go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

result, err := divide(10, 2)
\`\`\`

## Variadic Functions

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(sum(1, 2, 3, 4, 5)) // 15
\`\`\``,
    contentRu: `# Функции в Go

## Функция — это рецепт

Функция — готовый рецепт, который можно вызвать много раз. Дали ингредиенты — получили результат.

В Python:
\`\`\`python
def greet(name):
    return "Привет, " + name + "!"
\`\`\`

В Go:
\`\`\`go
func greet(name string) string {
    return "Привет, " + name + "!"
}
\`\`\`

Разница в деталях:
- \`def\` → \`func\`
- Нужно указать тип аргумента: \`name string\` (это текст)
- Нужно указать тип результата: второй \`string\` после скобок — "эта функция вернёт текст"

**Go хочет знать всё заранее.** Какого типа принимает, какого типа отдаёт. Зато потом не ошибается.

## Две вещи сразу — множественный возврат

Это суперспособность Go, которой нет в Python (в чистом виде).

Функция может вернуть **два значения**: результат и ошибку. Это очень удобно:

\`\`\`go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("деление на ноль")
    }
    return a / b, nil   // nil значит "ошибки нет"
}

result, err := divide(10, 2)
if err != nil {
    fmt.Println("Ошибка:", err)
} else {
    fmt.Println("Результат:", result)
}
\`\`\`

Представьте официанта, который возвращает или блюдо (и говорит "всё ок"), или пустую тарелку с запиской об ошибке. Вы всегда знаете что получили.

## Функции с любым количеством аргументов

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(sum(1, 2, 3))       // 6
fmt.Println(sum(10, 20, 30, 40)) // 100
\`\`\`

\`...int\` значит "сколько угодно чисел". В Python это аналог \`*args\`.`,
  })

  await exercise(db, ch4.id, {
    slug: 'go-functions-exercise', order: 2, xpReward: 35,
    titleEn: 'Temperature Converter', titleRu: 'Конвертер температуры',
    contentEn: '# Temperature Converter\n\nWrite two functions:\n1. `celsiusToFahrenheit(c float64) float64` — formula: `F = C * 9/5 + 32`\n2. `fahrenheitToCelsius(f float64) float64` — formula: `C = (F - 32) * 5/9`\n\nExpected output:\n```\n100.00°C = 212.00°F\n98.60°F = 37.00°C\n```',
    contentRu: `# Конвертер температуры

Напишите две функции перевода температуры.

**Из Цельсия в Фаренгейт:** умножить на 9, разделить на 5, прибавить 32
**Из Фаренгейта в Цельсий:** вычесть 32, умножить на 5, разделить на 9

В Python это выглядело бы так:
\`\`\`python
def celsius_to_fahrenheit(c):
    return c * 9/5 + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5/9
\`\`\`

В Go структура функций уже написана — вам нужно заменить \`return 0\` на правильную формулу.

Ожидаемый вывод:
\`\`\`
100.00°C = 212.00°F
98.60°F = 37.00°C
\`\`\``,
    instructionsEn: 'Implement temperature conversion functions and print results with 2 decimal places',
    instructionsRu: 'Замените return 0 на правильную формулу в каждой функции',
    starterCode: `package main

import "fmt"

func celsiusToFahrenheit(c float64) float64 {
    return 0 // Замените на: c*9/5 + 32
}

func fahrenheitToCelsius(f float64) float64 {
    return 0 // Замените на: (f-32) * 5/9
}

func main() {
    fmt.Printf("%.2f°C = %.2f°F\n", 100.0, celsiusToFahrenheit(100))
    fmt.Printf("%.2f°F = %.2f°C\n", 98.6, fahrenheitToCelsius(98.6))
}`,
    solutionCode: `package main

import "fmt"

func celsiusToFahrenheit(c float64) float64 {
    return c*9/5 + 32
}

func fahrenheitToCelsius(f float64) float64 {
    return (f - 32) * 5 / 9
}

func main() {
    fmt.Printf("%.2f°C = %.2f°F\n", 100.0, celsiusToFahrenheit(100))
    fmt.Printf("%.2f°F = %.2f°C\n", 98.6, fahrenheitToCelsius(98.6))
}`,
    testCases: [{ input: '', expectedOutput: '100.00°C = 212.00°F\n98.60°F = 37.00°C', isHidden: false }],
    hints: [
      { order: 1, textEn: 'C→F: multiply by 9, divide by 5, add 32', textRu: 'Цельсий → Фаренгейт: c*9/5 + 32' },
      { order: 2, textEn: 'F→C: subtract 32, multiply by 5, divide by 9', textRu: 'Фаренгейт → Цельсий: (f-32)*5/9 — скобки важны!' },
    ],
  })

  console.log('  ✓ Go course seeded')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface LessonData {
  slug: string; order: number; type: 'theory' | 'exercise' | 'quiz'
  titleEn: string; titleRu: string; contentEn: string; contentRu: string; xpReward: number
}

async function lesson(db: PrismaClient, chapterId: string, data: LessonData) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug: data.slug } },
    update: { contentEn: data.contentEn, contentRu: data.contentRu, titleEn: data.titleEn, titleRu: data.titleRu },
    create: { chapterId, isPublished: true, estimatedMin: 8, ...data },
  })
}

interface ExerciseData {
  slug: string; order: number; xpReward: number
  titleEn: string; titleRu: string; contentEn: string; contentRu: string
  instructionsEn: string; instructionsRu: string
  starterCode: string; solutionCode: string
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
  hints: { order: number; textEn: string; textRu: string }[]
}

async function exercise(db: PrismaClient, chapterId: string, data: ExerciseData) {
  const { instructionsEn, instructionsRu, starterCode, solutionCode, testCases, hints, ...lessonData } = data
  const l = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug: data.slug } },
    update: { contentEn: lessonData.contentEn, contentRu: lessonData.contentRu, titleEn: lessonData.titleEn, titleRu: lessonData.titleRu },
    create: { chapterId, type: 'exercise', isPublished: true, estimatedMin: 15, ...lessonData },
  })
  await db.exercise.upsert({
    where: { lessonId: l.id },
    update: { instructionsEn, instructionsRu, starterCode, solutionCode, hints },
    create: { lessonId: l.id, instructionsEn, instructionsRu, starterCode, solutionCode, language: 'go', timeoutMs: 5000, testCases, hints },
  })
  return l
}
