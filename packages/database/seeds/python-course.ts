import type { PrismaClient } from '@prisma/client'

export async function seedPythonCourse(db: PrismaClient) {
  // Create course
  const course = await db.course.upsert({
    where: { slug: 'python-basics' },
    update: {},
    create: {
      slug: 'python-basics',
      language: 'python',
      titleEn: 'Python Fundamentals',
      titleRu: 'Основы Python',
      descriptionEn: 'Learn Python from scratch. Variables, loops, functions, and OOP — all in one structured path.',
      descriptionRu: 'Изучи Python с нуля. Переменные, циклы, функции и ООП — всё в одном структурированном пути.',
      level: 1,
      order: 1,
      isPublished: true,
      totalXP: 650,
    },
  })

  // ─── CHAPTER 1: INTRODUCTION ─────────────────────────────────────────────────
  const ch1 = await upsertChapter(db, course.id, {
    slug: 'introduction',
    titleEn: 'Introduction to Python',
    titleRu: 'Введение в Python',
    order: 1,
  })

  await upsertLesson(db, ch1.id, {
    slug: 'what-is-python',
    type: 'theory',
    titleEn: 'What is Python?',
    titleRu: 'Что такое Python?',
    order: 1,
    xpReward: 10,
    estimatedMin: 5,
    contentEn: `
# What is Python?

Python is a **high-level**, **interpreted** programming language created by Guido van Rossum in 1991.

## Why Python?
- **Readable syntax** — code looks almost like English
- **Versatile** — web apps, AI/ML, automation, data analysis
- **Huge ecosystem** — over 400,000 packages on PyPI
- **Most popular language** in the world for beginners and professionals alike

## Where is Python used?
| Field | Examples |
|-------|---------|
| Web Development | Django, FastAPI, Flask |
| Artificial Intelligence | TensorFlow, PyTorch |
| Data Science | Pandas, NumPy, Matplotlib |
| Automation | Selenium, PyAutoGUI |
| Games | Pygame |

## Your first Python line
\`\`\`python
print("Hello, World!")
\`\`\`

The \`print()\` function displays text on the screen. Every time you call it, it outputs whatever you put inside the parentheses.
    `.trim(),
    contentRu: `
# Что такое Python?

Python — это **высокоуровневый**, **интерпретируемый** язык программирования, созданный Гвидо ван Россумом в 1991 году.

## Почему Python?
- **Читаемый синтаксис** — код выглядит почти как английский язык
- **Универсальность** — веб-приложения, ИИ/ML, автоматизация, анализ данных
- **Огромная экосистема** — более 400 000 пакетов на PyPI
- **Самый популярный язык** в мире как для новичков, так и для профессионалов

## Где используется Python?
| Область | Примеры |
|---------|---------|
| Веб-разработка | Django, FastAPI, Flask |
| Искусственный интеллект | TensorFlow, PyTorch |
| Анализ данных | Pandas, NumPy, Matplotlib |
| Автоматизация | Selenium, PyAutoGUI |
| Игры | Pygame |

## Твоя первая строка на Python
\`\`\`python
print("Привет, мир!")
\`\`\`

Функция \`print()\` выводит текст на экран. Каждый раз, когда ты её вызываешь, она отображает то, что указано в скобках.
    `.trim(),
  })

  await upsertLesson(db, ch1.id, {
    slug: 'first-program',
    type: 'exercise',
    titleEn: 'Your First Program',
    titleRu: 'Первая программа',
    order: 2,
    xpReward: 20,
    estimatedMin: 10,
    contentEn: `
# Exercise: Your First Python Program

Write a Python program that prints exactly:

\`\`\`
Hello, Python!
\`\`\`

Use the \`print()\` function with the exact text shown above.
    `.trim(),
    contentRu: `
# Задание: Первая программа на Python

Напиши программу на Python, которая выводит ровно:

\`\`\`
Hello, Python!
\`\`\`

Используй функцию \`print()\` с точным текстом, показанным выше.
    `.trim(),
    exercise: {
      instructionsEn: 'Print the text "Hello, Python!" using the print() function.',
      instructionsRu: 'Выведи текст "Hello, Python!" с помощью функции print().',
      starterCode: '# Write your code here\n',
      solutionCode: 'print("Hello, Python!")\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: 'Hello, Python!', isHidden: false },
      ],
      hints: [
        { order: 1, textEn: 'Use the print() function', textRu: 'Используй функцию print()' },
        { order: 2, textEn: 'Put the text in quotes inside print(): print("your text")', textRu: 'Помести текст в кавычки внутри print(): print("твой текст")' },
      ],
    },
  })

  await upsertLesson(db, ch1.id, {
    slug: 'intro-quiz',
    type: 'quiz',
    titleEn: 'Quiz: Python Basics',
    titleRu: 'Тест: Основы Python',
    order: 3,
    xpReward: 15,
    estimatedMin: 5,
    contentEn: 'Test your knowledge of the Python introduction.',
    contentRu: 'Проверь свои знания введения в Python.',
    quizItems: [
      {
        order: 1,
        questionEn: 'Which function is used to display output in Python?',
        questionRu: 'Какая функция используется для вывода данных в Python?',
        options: [
          { textEn: 'console.log()', textRu: 'console.log()', isCorrect: false },
          { textEn: 'print()', textRu: 'print()', isCorrect: true },
          { textEn: 'echo()', textRu: 'echo()', isCorrect: false },
          { textEn: 'output()', textRu: 'output()', isCorrect: false },
        ],
        explanation: 'Python uses print() to display text on screen.',
      },
      {
        order: 2,
        questionEn: 'Who created Python?',
        questionRu: 'Кто создал Python?',
        options: [
          { textEn: 'Linus Torvalds', textRu: 'Линус Торвальдс', isCorrect: false },
          { textEn: 'Guido van Rossum', textRu: 'Гвидо ван Россум', isCorrect: true },
          { textEn: 'James Gosling', textRu: 'Джеймс Гослинг', isCorrect: false },
          { textEn: 'Brendan Eich', textRu: 'Брендан Эйх', isCorrect: false },
        ],
        explanation: 'Guido van Rossum created Python in 1991.',
      },
    ],
  })

  // ─── CHAPTER 2: VARIABLES & DATA TYPES ───────────────────────────────────────
  const ch2 = await upsertChapter(db, course.id, {
    slug: 'variables',
    titleEn: 'Variables & Data Types',
    titleRu: 'Переменные и типы данных',
    order: 2,
  })

  await upsertLesson(db, ch2.id, {
    slug: 'variables-theory',
    type: 'theory',
    titleEn: 'Variables',
    titleRu: 'Переменные',
    order: 1,
    xpReward: 10,
    estimatedMin: 8,
    contentEn: `
# Variables in Python

A **variable** is a named container that stores a value.

## Creating a variable
\`\`\`python
name = "Alice"      # String
age = 25            # Integer
height = 1.75       # Float
is_student = True   # Boolean
\`\`\`

## Python data types
| Type | Example | Description |
|------|---------|-------------|
| \`str\` | \`"Hello"\` | Text |
| \`int\` | \`42\` | Whole numbers |
| \`float\` | \`3.14\` | Decimal numbers |
| \`bool\` | \`True\` / \`False\` | True or False |

## Checking types
\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

## Dynamic typing
Python figures out the type automatically — no need to declare it:
\`\`\`python
x = 10       # int
x = "hello"  # now it's a str — totally valid!
\`\`\`
    `.trim(),
    contentRu: `
# Переменные в Python

**Переменная** — это именованный контейнер, который хранит значение.

## Создание переменной
\`\`\`python
name = "Алиса"      # Строка
age = 25            # Целое число
height = 1.75       # Число с плавающей точкой
is_student = True   # Булево значение
\`\`\`

## Типы данных в Python
| Тип | Пример | Описание |
|-----|--------|----------|
| \`str\` | \`"Привет"\` | Текст |
| \`int\` | \`42\` | Целые числа |
| \`float\` | \`3.14\` | Дробные числа |
| \`bool\` | \`True\` / \`False\` | Истина или Ложь |

## Проверка типов
\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

## Динамическая типизация
Python определяет тип автоматически — не нужно его объявлять:
\`\`\`python
x = 10       # int
x = "привет" # теперь str — это допустимо!
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch2.id, {
    slug: 'variables-exercise',
    type: 'exercise',
    titleEn: 'Variables Practice',
    titleRu: 'Практика: переменные',
    order: 2,
    xpReward: 25,
    estimatedMin: 15,
    contentEn: `
# Exercise: Variables and f-strings

Declare three variables with **your own values** and print them using an f-string.

Requirements:
- Name the variables exactly: \`name\` (string), \`age\` (number), \`city\` (string)
- Use an f-string inside \`print()\` — the curly-brace syntax: \`{name}\`
- Any values and any output format are accepted — just use the variables, not hardcoded text
    `.trim(),
    contentRu: `
# Задание: переменные и f-строки

Объяви три переменные с **любыми значениями** и выведи их через f-строку.

Условия:
- Назови переменные именно так: \`name\` (строка), \`age\` (число), \`city\` (строка)
- Внутри \`print()\` используй f-строку — синтаксис с фигурными скобками: \`{name}\`
- Формат вывода — любой, главное что значения берутся из переменных, а не написаны вручную

Пример (можешь написать по-другому):
\`\`\`python
name = "Алиса"
age = 20
city = "Москва"
print(f"Меня зовут {name}, мне {age} лет, я из {city}")
\`\`\`
    `.trim(),
    exercise: {
      instructionsEn: 'Declare name, age, city variables and print them using an f-string',
      instructionsRu: 'Объяви переменные name, age, city — любые значения — и выведи их через f-строку',
      starterCode: '# Объяви три переменные:\nname = \nage = \ncity = \n\n# Выведи их через f-строку:\nprint(f"")\n',
      solutionCode: 'name = "Алиса"\nage = 20\ncity = "Москва"\nprint(f"Меня зовут {name}, мне {age} лет, я из {city}")\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        {
          input: '',
          // Appended after user code: checks name/age/city were declared, gives Russian error if not
          suffixCode: [
            '',
            '# === validator ===',
            '_ok = True',
            'try:',
            '    _ = (name, age, city)',
            'except NameError as _e:',
            '    _ok = False',
            '    print(f"\\nОшибка: переменная не объявлена — {_e}")',
            'if _ok:',
            '    print("__ok__")',
          ].join('\n'),
          expectedOutput: '__ok__',
          matchType: 'contains',
          isHidden: false,
        },
      ],
      hints: [
        { order: 1, textEn: 'Declare: name = "Alice" (or any name you like)', textRu: 'Пиши: name = "Алиса" — строка в кавычках. age = 20 — число без кавычек' },
        { order: 2, textEn: 'F-string: print(f"Hello {name}") — the variable goes inside {curly braces}', textRu: 'F-строка: print(f"Привет {name}") — переменная в фигурных скобках. Буква f перед кавычкой обязательна!' },
      ],
    },
  })

  await upsertLesson(db, ch2.id, {
    slug: 'strings-exercise',
    type: 'exercise',
    titleEn: 'String Operations',
    titleRu: 'Операции со строками',
    order: 3,
    xpReward: 30,
    estimatedMin: 15,
    contentEn: `
# Exercise: String Magic

Given the string \`text = "Hello, Python!"\`, print:
1. Its length: \`14\`
2. It in UPPERCASE: \`HELLO, PYTHON!\`
3. It reversed: \`!nohtyP ,olleH\`

Use: \`len()\`, \`.upper()\`, slicing \`[::-1]\`
    `.trim(),
    contentRu: `
# Задание: Магия строк

Дана строка \`text = "Hello, Python!"\`, выведи:
1. Её длину: \`14\`
2. Её в ВЕРХНЕМ РЕГИСТРЕ: \`HELLO, PYTHON!\`
3. Её в обратном порядке: \`!nohtyP ,olleH\`

Используй: \`len()\`, \`.upper()\`, срез \`[::-1]\`
    `.trim(),
    exercise: {
      instructionsEn: 'Print length, uppercase, and reversed version of the given string.',
      instructionsRu: 'Выведи длину, версию в верхнем регистре и перевёрнутую строку.',
      starterCode: 'text = "Hello, Python!"\n\n# 1. Print length\n\n# 2. Print uppercase\n\n# 3. Print reversed\n',
      solutionCode: 'text = "Hello, Python!"\nprint(len(text))\nprint(text.upper())\nprint(text[::-1])\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: '14\nHELLO, PYTHON!\n!nohtyP ,olleH', isHidden: false },
      ],
      hints: [
        { order: 1, textEn: 'len(text) gives you the length', textRu: 'len(text) даёт длину строки' },
        { order: 2, textEn: 'text.upper() converts to uppercase', textRu: 'text.upper() переводит в верхний регистр' },
        { order: 3, textEn: 'text[::-1] reverses a string', textRu: 'text[::-1] переворачивает строку' },
      ],
    },
  })

  // ─── CHAPTER 3: CONTROL FLOW ─────────────────────────────────────────────────
  const ch3 = await upsertChapter(db, course.id, {
    slug: 'control-flow',
    titleEn: 'Control Flow',
    titleRu: 'Управляющие конструкции',
    order: 3,
  })

  await upsertLesson(db, ch3.id, {
    slug: 'if-else-theory',
    type: 'theory',
    titleEn: 'If/Else Statements',
    titleRu: 'Условия if/else',
    order: 1,
    xpReward: 10,
    estimatedMin: 8,
    contentEn: `
# If/Else in Python

Conditionals let your program make decisions.

## Basic if
\`\`\`python
age = 18
if age >= 18:
    print("Adult")
\`\`\`

## if / else
\`\`\`python
age = 15
if age >= 18:
    print("Adult")
else:
    print("Minor")
# Output: Minor
\`\`\`

## if / elif / else
\`\`\`python
score = 75
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")
# Output: C
\`\`\`

## Comparison operators
| Operator | Meaning |
|----------|---------|
| \`==\` | Equal |
| \`!=\` | Not equal |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater or equal |
| \`<=\` | Less or equal |
    `.trim(),
    contentRu: `
# Условия if/else в Python

Условия позволяют программе принимать решения.

## Простой if
\`\`\`python
age = 18
if age >= 18:
    print("Взрослый")
\`\`\`

## if / else
\`\`\`python
age = 15
if age >= 18:
    print("Взрослый")
else:
    print("Несовершеннолетний")
# Вывод: Несовершеннолетний
\`\`\`

## if / elif / else
\`\`\`python
score = 75
if score >= 90:
    print("Отлично")
elif score >= 80:
    print("Хорошо")
elif score >= 70:
    print("Удовлетворительно")
else:
    print("Неудовлетворительно")
# Вывод: Удовлетворительно
\`\`\`

## Операторы сравнения
| Оператор | Значение |
|----------|----------|
| \`==\` | Равно |
| \`!=\` | Не равно |
| \`>\` | Больше |
| \`<\` | Меньше |
| \`>=\` | Больше или равно |
| \`<=\` | Меньше или равно |
    `.trim(),
  })

  await upsertLesson(db, ch3.id, {
    slug: 'if-else-exercise',
    type: 'exercise',
    titleEn: 'Grade Calculator',
    titleRu: 'Калькулятор оценок',
    order: 2,
    xpReward: 35,
    estimatedMin: 20,
    contentEn: `
# Exercise: Grade Calculator

Write a program that takes a score (0-100) and prints the grade:
- 90-100 → \`A\`
- 80-89 → \`B\`
- 70-79 → \`C\`
- 60-69 → \`D\`
- Below 60 → \`F\`

Test with \`score = 85\` — should print \`B\`.
    `.trim(),
    contentRu: `
# Задание: Калькулятор оценок

Напиши программу, которая принимает оценку (0-100) и выводит букву:
- 90-100 → \`A\`
- 80-89 → \`B\`
- 70-79 → \`C\`
- 60-69 → \`D\`
- Ниже 60 → \`F\`

Проверь с \`score = 85\` — должно вывести \`B\`.
    `.trim(),
    exercise: {
      instructionsEn: 'Use if/elif/else to determine the letter grade.',
      instructionsRu: 'Используй if/elif/else для определения буквенной оценки.',
      starterCode: 'score = 85\n\n# Write your grade logic here\n',
      solutionCode: 'score = 85\n\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: 'B', isHidden: false },
        { input: '', expectedOutput: 'A', isHidden: true },
        { input: '', expectedOutput: 'F', isHidden: true },
      ],
      hints: [
        { order: 1, textEn: 'Start with: if score >= 90:', textRu: 'Начни с: if score >= 90:' },
        { order: 2, textEn: 'Use elif for each additional condition', textRu: 'Используй elif для каждого следующего условия' },
      ],
    },
  })

  await upsertLesson(db, ch3.id, {
    slug: 'loops-theory',
    type: 'theory',
    titleEn: 'Loops',
    titleRu: 'Циклы',
    order: 3,
    xpReward: 10,
    estimatedMin: 10,
    contentEn: `
# Loops in Python

Loops let you repeat code without copy-pasting.

## for loop
\`\`\`python
for i in range(5):
    print(i)
# Output: 0 1 2 3 4
\`\`\`

## Iterating over a list
\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

## while loop
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
# Output: 0 1 2
\`\`\`

## range() function
\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 6)     # 1, 2, 3, 4, 5
range(0, 10, 2) # 0, 2, 4, 6, 8  (step=2)
\`\`\`

## break and continue
\`\`\`python
for i in range(10):
    if i == 5:
        break      # stop the loop
    if i % 2 == 0:
        continue   # skip even numbers
    print(i)
# Output: 1 3
\`\`\`
    `.trim(),
    contentRu: `
# Циклы в Python

Циклы позволяют повторять код без копирования.

## Цикл for
\`\`\`python
for i in range(5):
    print(i)
# Вывод: 0 1 2 3 4
\`\`\`

## Перебор списка
\`\`\`python
fruits = ["яблоко", "банан", "вишня"]
for fruit in fruits:
    print(fruit)
\`\`\`

## Цикл while
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
# Вывод: 0 1 2
\`\`\`

## Функция range()
\`\`\`python
range(5)        # 0, 1, 2, 3, 4
range(1, 6)     # 1, 2, 3, 4, 5
range(0, 10, 2) # 0, 2, 4, 6, 8  (шаг=2)
\`\`\`

## break и continue
\`\`\`python
for i in range(10):
    if i == 5:
        break      # остановить цикл
    if i % 2 == 0:
        continue   # пропустить чётные
    print(i)
# Вывод: 1 3
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch3.id, {
    slug: 'loops-exercise',
    type: 'exercise',
    titleEn: 'Sum of Numbers',
    titleRu: 'Сумма чисел',
    order: 4,
    xpReward: 40,
    estimatedMin: 20,
    contentEn: `
# Exercise: FizzBuzz

Print numbers from 1 to 15. But:
- For multiples of 3, print \`Fizz\`
- For multiples of 5, print \`Buzz\`
- For multiples of both 3 and 5, print \`FizzBuzz\`

Expected output (first 15 lines):
\`\`\`
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`
    `.trim(),
    contentRu: `
# Задание: FizzBuzz

Выводи числа от 1 до 15. Но:
- Для кратных 3 — выводи \`Fizz\`
- Для кратных 5 — выводи \`Buzz\`
- Для кратных и 3 и 5 — выводи \`FizzBuzz\`

Ожидаемый вывод (первые 15 строк):
\`\`\`
1
2
Fizz
4
Buzz
...
FizzBuzz
\`\`\`
    `.trim(),
    exercise: {
      instructionsEn: 'Use a for loop with range(1, 16) and if/elif/else with % operator.',
      instructionsRu: 'Используй цикл for с range(1, 16) и if/elif/else с оператором %.',
      starterCode: '# FizzBuzz: numbers 1 to 15\nfor i in range(1, 16):\n    # your logic here\n    pass\n',
      solutionCode: 'for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        {
          input: '',
          expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
          isHidden: false,
        },
      ],
      hints: [
        { order: 1, textEn: 'Check divisibility with %: if i % 3 == 0', textRu: 'Проверяй делимость через %: if i % 3 == 0' },
        { order: 2, textEn: 'Check FizzBuzz FIRST (i % 15 == 0) before the others', textRu: 'Проверяй FizzBuzz ПЕРВЫМ (i % 15 == 0), до остальных условий' },
      ],
    },
  })

  // ─── CHAPTER 4: FUNCTIONS ────────────────────────────────────────────────────
  const ch4 = await upsertChapter(db, course.id, {
    slug: 'functions',
    titleEn: 'Functions',
    titleRu: 'Функции',
    order: 4,
  })

  await upsertLesson(db, ch4.id, {
    slug: 'functions-theory',
    type: 'theory',
    titleEn: 'Defining Functions',
    titleRu: 'Определение функций',
    order: 1,
    xpReward: 10,
    estimatedMin: 10,
    contentEn: `
# Functions in Python

A **function** is a reusable block of code. Define once, use many times.

## Defining a function
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")
print(result)  # Hello, Alice!
\`\`\`

## Default arguments
\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))    # 9  (3²)
print(power(2, 8)) # 256 (2⁸)
\`\`\`

## Multiple return values
\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5, 9])
print(low, high)  # 1 9
\`\`\`

## Scope: local vs global
\`\`\`python
x = 10  # global

def double():
    x = 20  # local — doesn't affect global x
    return x

print(double())  # 20
print(x)         # 10 — unchanged
\`\`\`
    `.trim(),
    contentRu: `
# Функции в Python

**Функция** — это многократно используемый блок кода. Определяй один раз, используй много раз.

## Определение функции
\`\`\`python
def greet(name):
    return f"Привет, {name}!"

result = greet("Алиса")
print(result)  # Привет, Алиса!
\`\`\`

## Аргументы по умолчанию
\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))    # 9  (3²)
print(power(2, 8)) # 256 (2⁸)
\`\`\`

## Несколько возвращаемых значений
\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5, 9])
print(low, high)  # 1 9
\`\`\`

## Область видимости: локальная vs глобальная
\`\`\`python
x = 10  # глобальная

def double():
    x = 20  # локальная — не влияет на глобальную x
    return x

print(double())  # 20
print(x)         # 10 — не изменилась
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch4.id, {
    slug: 'functions-exercise',
    type: 'exercise',
    titleEn: 'Calculator Function',
    titleRu: 'Функция калькулятор',
    order: 2,
    xpReward: 45,
    estimatedMin: 25,
    contentEn: `
# Exercise: Calculator

Write a function \`calculate(a, b, op)\` that:
- Takes two numbers \`a\`, \`b\` and an operator \`op\` (+, -, *, /)
- Returns the result
- Returns \`"Error: division by zero"\` if dividing by 0

Test cases:
\`\`\`python
print(calculate(10, 5, "+"))  # 15
print(calculate(10, 5, "-"))  # 5
print(calculate(10, 5, "*"))  # 50
print(calculate(10, 5, "/"))  # 2.0
print(calculate(10, 0, "/"))  # Error: division by zero
\`\`\`
    `.trim(),
    contentRu: `
# Задание: Калькулятор

Напиши функцию \`calculate(a, b, op)\` которая:
- Принимает два числа \`a\`, \`b\` и оператор \`op\` (+, -, *, /)
- Возвращает результат
- Возвращает \`"Error: division by zero"\` при делении на 0

Тестовые случаи:
\`\`\`python
print(calculate(10, 5, "+"))  # 15
print(calculate(10, 5, "-"))  # 5
print(calculate(10, 5, "*"))  # 50
print(calculate(10, 5, "/"))  # 2.0
print(calculate(10, 0, "/"))  # Error: division by zero
\`\`\`
    `.trim(),
    exercise: {
      instructionsEn: 'Define the calculate() function and test it with all operators.',
      instructionsRu: 'Определи функцию calculate() и протестируй со всеми операторами.',
      starterCode: 'def calculate(a, b, op):\n    # your code here\n    pass\n\nprint(calculate(10, 5, "+"))\nprint(calculate(10, 5, "-"))\nprint(calculate(10, 5, "*"))\nprint(calculate(10, 5, "/"))\nprint(calculate(10, 0, "/"))\n',
      solutionCode: 'def calculate(a, b, op):\n    if op == "+":\n        return a + b\n    elif op == "-":\n        return a - b\n    elif op == "*":\n        return a * b\n    elif op == "/":\n        if b == 0:\n            return "Error: division by zero"\n        return a / b\n\nprint(calculate(10, 5, "+"))\nprint(calculate(10, 5, "-"))\nprint(calculate(10, 5, "*"))\nprint(calculate(10, 5, "/"))\nprint(calculate(10, 0, "/"))\n',
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        {
          input: '',
          expectedOutput: '15\n5\n50\n2.0\nError: division by zero',
          isHidden: false,
        },
      ],
      hints: [
        { order: 1, textEn: 'Use if/elif to check the operator: if op == "+":', textRu: 'Используй if/elif для проверки оператора: if op == "+":' },
        { order: 2, textEn: 'Check b == 0 before dividing', textRu: 'Проверь b == 0 перед делением' },
      ],
    },
  })

  // ─── CHAPTER 5: LISTS AND COLLECTIONS ───────────────────────────────────────
  const ch5 = await upsertChapter(db, course.id, {
    slug: 'lists-collections',
    titleEn: 'Lists and Collections',
    titleRu: 'Списки и коллекции',
    order: 5,
  })

  await upsertLesson(db, ch5.id, {
    slug: 'lists-theory',
    type: 'theory',
    titleEn: 'Lists, Tuples, and Dictionaries',
    titleRu: 'Списки, кортежи и словари',
    order: 1,
    xpReward: 12,
    estimatedMin: 10,
    contentEn: `
# Lists, Tuples, and Dictionaries

## Lists

Lists are **ordered, mutable** sequences.

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# Access
print(fruits[0])   # apple
print(fruits[-1])  # cherry (last element)

# Slice
print(fruits[1:3]) # ['banana', 'cherry']

# Modify
fruits.append("mango")        # add to end
fruits.insert(1, "blueberry") # insert at index
fruits.remove("banana")       # remove by value
popped = fruits.pop()         # remove & return last

# Common operations
print(len(fruits))        # length
print("apple" in fruits)  # True/False
fruits.sort()             # sort in place
fruits.reverse()          # reverse in place
\`\`\`

## List Comprehensions

\`\`\`python
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, ..., 18]
\`\`\`

## Tuples

Tuples are **ordered, immutable** — they can't be changed after creation.

\`\`\`python
point = (10, 20)
x, y = point  # unpacking

# Useful for coordinates, RGB colors, function return values
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
\`\`\`

## Dictionaries

Dictionaries store **key-value pairs** (like JSON).

\`\`\`python
student = {
    "name": "Alice",
    "age": 20,
    "gpa": 3.8,
}

# Access
print(student["name"])           # Alice
print(student.get("major", "N/A"))  # N/A (default)

# Modify
student["age"] = 21
student["major"] = "CS"
del student["gpa"]

# Iterate
for key, value in student.items():
    print(f"{key}: {value}")

# Check existence
print("name" in student)  # True
\`\`\`

## Sets

Sets store **unique, unordered** values.

\`\`\`python
tags = {"python", "web", "api", "python"}  # duplicates removed
tags.add("backend")

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # intersection: {3, 4}
print(a | b)  # union: {1, 2, 3, 4, 5, 6}
print(a - b)  # difference: {1, 2}
\`\`\`
    `.trim(),
    contentRu: `
# Списки, кортежи и словари

## Списки

Списки — **упорядоченные, изменяемые** последовательности.

\`\`\`python
fruits = ["яблоко", "банан", "вишня"]

# Доступ
print(fruits[0])   # яблоко
print(fruits[-1])  # вишня (последний элемент)

# Изменение
fruits.append("манго")         # добавить в конец
fruits.insert(1, "черника")    # вставить по индексу
fruits.remove("банан")         # удалить по значению
popped = fruits.pop()          # удалить и вернуть последний

# Операции
print(len(fruits))             # длина
print("яблоко" in fruits)      # True/False
fruits.sort()                  # сортировать на месте
\`\`\`

## Генераторы списков

\`\`\`python
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

evens = [x for x in range(20) if x % 2 == 0]
\`\`\`

## Кортежи

Кортежи — **упорядоченные, неизменяемые** последовательности.

\`\`\`python
point = (10, 20)
x, y = point  # распаковка
\`\`\`

## Словари

Словари хранят пары **ключ-значение** (как JSON).

\`\`\`python
student = {
    "name": "Алиса",
    "age": 20,
    "gpa": 3.8,
}

print(student["name"])               # Алиса
print(student.get("major", "N/A"))   # N/A (по умолчанию)

for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## Множества

Множества хранят **уникальные, неупорядоченные** значения.

\`\`\`python
tags = {"python", "web", "api", "python"}  # дубликаты удалены
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)  # пересечение: {3, 4}
print(a | b)  # объединение
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch5.id, {
    slug: 'lists-exercise',
    type: 'exercise',
    titleEn: 'List Processing',
    titleRu: 'Обработка списков',
    order: 2,
    xpReward: 30,
    estimatedMin: 15,
    contentEn: `
# List Processing

Given a list of numbers, write a function \`analyze(numbers)\` that returns a dictionary with:
- \`"sum"\` — the total sum
- \`"avg"\` — the average (rounded to 2 decimal places)
- \`"min"\` — the minimum value
- \`"max"\` — the maximum value
- \`"count"\` — number of elements

Then print the results for \`[4, 7, 2, 9, 1, 5, 8, 3, 6]\`:
\`\`\`
sum: 45
avg: 5.0
min: 1
max: 9
count: 9
\`\`\`
    `.trim(),
    contentRu: `
# Обработка списков

Напишите функцию \`analyze(numbers)\`, которая возвращает словарь с:
- \`"sum"\` — сумма всех элементов
- \`"avg"\` — среднее (округлённое до 2 знаков)
- \`"min"\` — минимальное значение
- \`"max"\` — максимальное значение
- \`"count"\` — количество элементов

Выведите результаты для \`[4, 7, 2, 9, 1, 5, 8, 3, 6]\`:
\`\`\`
sum: 45
avg: 5.0
min: 1
max: 9
count: 9
\`\`\`
    `.trim(),
    exercise: {
      instructionsEn: 'Implement analyze() and print each stat on its own line',
      instructionsRu: 'Реализуйте analyze() и выведите каждый показатель на отдельной строке',
      starterCode: `def analyze(numbers):
    # Return a dict with sum, avg, min, max, count
    pass

nums = [4, 7, 2, 9, 1, 5, 8, 3, 6]
result = analyze(nums)
print(f"sum: {result['sum']}")
print(f"avg: {result['avg']}")
print(f"min: {result['min']}")
print(f"max: {result['max']}")
print(f"count: {result['count']}")`,
      solutionCode: `def analyze(numbers):
    return {
        "sum": sum(numbers),
        "avg": round(sum(numbers) / len(numbers), 2),
        "min": min(numbers),
        "max": max(numbers),
        "count": len(numbers),
    }

nums = [4, 7, 2, 9, 1, 5, 8, 3, 6]
result = analyze(nums)
print(f"sum: {result['sum']}")
print(f"avg: {result['avg']}")
print(f"min: {result['min']}")
print(f"max: {result['max']}")
print(f"count: {result['count']}")`,
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: 'sum: 45\navg: 5.0\nmin: 1\nmax: 9\ncount: 9', isHidden: false },
      ],
      hints: [
        { order: 1, textEn: 'Use built-in functions: sum(), min(), max(), len()', textRu: 'Используйте встроенные функции: sum(), min(), max(), len()' },
        { order: 2, textEn: 'avg = round(sum(numbers) / len(numbers), 2)', textRu: 'avg = round(sum(numbers) / len(numbers), 2)' },
      ],
    },
  })

  // ─── CHAPTER 6: OOP ──────────────────────────────────────────────────────────
  const ch6 = await upsertChapter(db, course.id, {
    slug: 'oop',
    titleEn: 'Object-Oriented Programming',
    titleRu: 'Объектно-ориентированное программирование',
    order: 6,
  })

  await upsertLesson(db, ch6.id, {
    slug: 'oop-theory',
    type: 'theory',
    titleEn: 'Classes and Objects',
    titleRu: 'Классы и объекты',
    order: 1,
    xpReward: 12,
    estimatedMin: 12,
    contentEn: `
# Classes and Objects in Python

OOP organises code into **classes** — blueprints for creating **objects**.

## Defining a Class

\`\`\`python
class Dog:
    # Class attribute (shared by all instances)
    species = "Canis familiaris"

    # Constructor
    def __init__(self, name, age):
        self.name = name  # instance attribute
        self.age = age

    # Instance method
    def speak(self, sound="Woof"):
        return f"{self.name} says {sound}!"

    # String representation
    def __str__(self):
        return f"Dog({self.name}, {self.age})"

# Creating objects
rex = Dog("Rex", 5)
luna = Dog("Luna", 3)

print(rex.speak())          # Rex says Woof!
print(luna.speak("Bark"))   # Luna says Bark!
print(rex)                  # Dog(Rex, 5)
print(Dog.species)          # Canis familiaris
\`\`\`

## Inheritance

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

class Duck(Animal):
    def speak(self):
        return f"{self.name} says Quack!"

animals = [Cat("Whiskers"), Duck("Donald")]
for animal in animals:
    print(animal.speak())  # polymorphism!
\`\`\`

## Special Methods (Dunder)

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)  # Vector(4, 6)
\`\`\`

## Properties

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        import math
        return round(math.pi * self._radius ** 2, 2)
\`\`\`
    `.trim(),
    contentRu: `
# Классы и объекты в Python

ООП организует код в **классы** — шаблоны для создания **объектов**.

## Определение класса

\`\`\`python
class Dog:
    species = "Canis familiaris"  # атрибут класса

    def __init__(self, name, age):
        self.name = name  # атрибут экземпляра
        self.age = age

    def speak(self, sound="Гав"):
        return f"{self.name} говорит {sound}!"

    def __str__(self):
        return f"Dog({self.name}, {self.age})"

rex = Dog("Рекс", 5)
print(rex.speak())    # Рекс говорит Гав!
print(rex)            # Dog(Рекс, 5)
\`\`\`

## Наследование

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Cat(Animal):
    def speak(self):
        return f"{self.name} говорит Мяу!"

class Duck(Animal):
    def speak(self):
        return f"{self.name} говорит Кря!"

# Полиморфизм
for animal in [Cat("Мурка"), Duck("Дональд")]:
    print(animal.speak())
\`\`\`

## Свойства (property)

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Радиус не может быть отрицательным")
        self._radius = value
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch6.id, {
    slug: 'oop-exercise',
    type: 'exercise',
    titleEn: 'Build a Bank Account',
    titleRu: 'Создайте банковский счёт',
    order: 2,
    xpReward: 40,
    estimatedMin: 20,
    contentEn: `
# Build a Bank Account

Create a \`BankAccount\` class with:
- Constructor: \`__init__(self, owner, balance=0)\`
- Method \`deposit(amount)\` — adds to balance, prints \`"Deposited 100. Balance: 100"\`
- Method \`withdraw(amount)\` — subtracts, prints \`"Withdrew 30. Balance: 70"\` or \`"Insufficient funds"\` if not enough
- Method \`__str__\` — returns \`"BankAccount(Alice, 70)"\`

Expected output:
\`\`\`
Deposited 100. Balance: 100
Withdrew 30. Balance: 70
Insufficient funds
BankAccount(Alice, 70)
\`\`\`
    `.trim(),
    contentRu: `
# Создайте банковский счёт

Создайте класс \`BankAccount\` с:
- Конструктором: \`__init__(self, owner, balance=0)\`
- Методом \`deposit(amount)\` — пополнение: выводит \`"Deposited 100. Balance: 100"\`
- Методом \`withdraw(amount)\` — снятие: выводит \`"Withdrew 30. Balance: 70"\` или \`"Insufficient funds"\`
- Методом \`__str__\` — возвращает \`"BankAccount(Alice, 70)"\`

Ожидаемый вывод:
\`\`\`
Deposited 100. Balance: 100
Withdrew 30. Balance: 70
Insufficient funds
BankAccount(Alice, 70)
\`\`\`
    `.trim(),
    exercise: {
      instructionsEn: 'Implement BankAccount class with deposit, withdraw, and __str__ methods',
      instructionsRu: 'Реализуйте класс BankAccount с методами deposit, withdraw и __str__',
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        pass  # TODO

    def withdraw(self, amount):
        pass  # TODO

    def __str__(self):
        pass  # TODO

acc = BankAccount("Alice")
acc.deposit(100)
acc.withdraw(30)
acc.withdraw(200)
print(acc)`,
      solutionCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited {amount}. Balance: {self.balance}")

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        else:
            self.balance -= amount
            print(f"Withdrew {amount}. Balance: {self.balance}")

    def __str__(self):
        return f"BankAccount({self.owner}, {self.balance})"

acc = BankAccount("Alice")
acc.deposit(100)
acc.withdraw(30)
acc.withdraw(200)
print(acc)`,
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        {
          input: '',
          expectedOutput: 'Deposited 100. Balance: 100\nWithdrew 30. Balance: 70\nInsufficient funds\nBankAccount(Alice, 70)',
          isHidden: false,
        },
      ],
      hints: [
        { order: 1, textEn: 'In deposit: self.balance += amount, then print', textRu: 'В deposit: self.balance += amount, затем print' },
        { order: 2, textEn: 'In withdraw: check if amount > self.balance first', textRu: 'В withdraw: сначала проверьте amount > self.balance' },
        { order: 3, textEn: '__str__ should return f"BankAccount({self.owner}, {self.balance})"', textRu: '__str__ должен возвращать f"BankAccount({self.owner}, {self.balance})"' },
      ],
    },
  })

  // ─── CHAPTER 7: EXCEPTIONS ───────────────────────────────────────────────────
  const ch7 = await upsertChapter(db, course.id, {
    slug: 'exceptions',
    titleEn: 'Exceptions & Error Handling',
    titleRu: 'Исключения и обработка ошибок',
    order: 7,
  })

  await upsertLesson(db, ch7.id, {
    slug: 'exceptions-theory',
    type: 'theory',
    titleEn: 'Handling Errors Like a Pro',
    titleRu: 'Обработка ошибок профессионально',
    order: 1,
    xpReward: 15,
    estimatedMin: 10,
    contentEn: `
# Exceptions & Error Handling

Errors happen. Python uses **exceptions** to signal when something goes wrong.

## Basic try/except
\`\`\`python
try:
    x = int("hello")   # raises ValueError
except ValueError:
    print("Not a number!")
\`\`\`

## Multiple except blocks
\`\`\`python
try:
    result = 10 / int(input())
except ZeroDivisionError:
    print("Can't divide by zero")
except ValueError:
    print("Please enter a number")
\`\`\`

## else and finally
\`\`\`python
try:
    f = open("data.txt")
except FileNotFoundError:
    print("File not found")
else:
    print(f.read())    # runs only if no exception
finally:
    print("Done")      # always runs
\`\`\`

## Raising exceptions
\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    return age
\`\`\`

## Custom exceptions
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        super().__init__(f"Need {amount}, have {balance}")
        self.amount = amount
        self.balance = balance

raise InsufficientFundsError(100, 50)
\`\`\`

## Common built-in exceptions
| Exception | When |
|-----------|------|
| \`ValueError\` | Wrong value type (\`int("abc")\`) |
| \`TypeError\` | Wrong type (\`"2" + 2\`) |
| \`ZeroDivisionError\` | Division by zero |
| \`IndexError\` | List index out of range |
| \`KeyError\` | Dict key not found |
| \`FileNotFoundError\` | File doesn't exist |
| \`AttributeError\` | Object has no attribute |

## Exception hierarchy
\`\`\`
BaseException
 └── Exception
      ├── ValueError
      ├── TypeError
      ├── ArithmeticError
      │    └── ZeroDivisionError
      └── LookupError
           ├── IndexError
           └── KeyError
\`\`\`

Catching a parent catches all children: \`except Exception\` catches most errors.
    `.trim(),
    contentRu: `
# Исключения и обработка ошибок

Ошибки случаются. Python использует **исключения**, чтобы сигнализировать о проблемах.

## Базовый try/except
\`\`\`python
try:
    x = int("hello")   # вызывает ValueError
except ValueError:
    print("Это не число!")
\`\`\`

## Несколько блоков except
\`\`\`python
try:
    result = 10 / int(input())
except ZeroDivisionError:
    print("Нельзя делить на ноль")
except ValueError:
    print("Введите число")
\`\`\`

## else и finally
\`\`\`python
try:
    f = open("data.txt")
except FileNotFoundError:
    print("Файл не найден")
else:
    print(f.read())    # выполняется только без исключения
finally:
    print("Готово")    # выполняется всегда
\`\`\`

## Генерация исключений
\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError(f"Возраст не может быть отрицательным: {age}")
    return age
\`\`\`

## Собственные исключения
\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        super().__init__(f"Нужно {amount}, есть {balance}")
        self.amount = amount
        self.balance = balance

raise InsufficientFundsError(100, 50)
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch7.id, {
    slug: 'exceptions-exercise',
    type: 'exercise',
    titleEn: 'Safe Calculator',
    titleRu: 'Безопасный калькулятор',
    order: 2,
    xpReward: 40,
    estimatedMin: 20,
    contentEn: 'Implement safe_divide and to_int functions with proper error handling.',
    contentRu: 'Реализуй функции safe_divide и to_int с правильной обработкой ошибок.',
    exercise: {
      instructionsEn: `Implement two functions:

**safe_divide(a, b)** — returns \`a / b\` as a float, or the string \`"Error: division by zero"\` if \`b\` is 0.

**to_int(s)** — converts string \`s\` to int, or returns \`"Error: invalid input"\` if conversion fails.

Expected output:
\`\`\`
5.0
Error: division by zero
42
Error: invalid input
\`\`\``,
      instructionsRu: `Реализуй две функции:

**safe_divide(a, b)** — возвращает \`a / b\` как float, или строку \`"Error: division by zero"\` если \`b\` равно 0.

**to_int(s)** — конвертирует строку \`s\` в int, или возвращает \`"Error: invalid input"\` при неудаче.

Ожидаемый вывод:
\`\`\`
5.0
Error: division by zero
42
Error: invalid input
\`\`\``,
      starterCode: `def safe_divide(a, b):
    # Handle ZeroDivisionError
    pass

def to_int(s):
    # Handle ValueError
    pass

print(safe_divide(10, 2))
print(safe_divide(7, 0))
print(to_int("42"))
print(to_int("abc"))
`,
      solutionCode: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Error: division by zero"

def to_int(s):
    try:
        return int(s)
    except ValueError:
        return "Error: invalid input"

print(safe_divide(10, 2))
print(safe_divide(7, 0))
print(to_int("42"))
print(to_int("abc"))
`,
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: '5.0\nError: division by zero\n42\nError: invalid input', isHidden: false },
      ],
      hints: [
        { order: 1, textEn: 'Wrap the division in try/except ZeroDivisionError', textRu: 'Оберни деление в try/except ZeroDivisionError' },
        { order: 2, textEn: 'For to_int: try int(s), catch ValueError', textRu: 'Для to_int: попробуй int(s), поймай ValueError' },
        { order: 3, textEn: 'Return the error string in the except block, not raise', textRu: 'Возвращай строку с ошибкой в блоке except, а не raise' },
      ],
    },
  })

  // ─── CHAPTER 8: FILE I/O & JSON ──────────────────────────────────────────────
  const ch8 = await upsertChapter(db, course.id, {
    slug: 'file-io',
    titleEn: 'File I/O & JSON',
    titleRu: 'Файлы и JSON',
    order: 8,
  })

  await upsertLesson(db, ch8.id, {
    slug: 'file-io-theory',
    type: 'theory',
    titleEn: 'Reading, Writing, and JSON',
    titleRu: 'Чтение, запись и JSON',
    order: 1,
    xpReward: 15,
    estimatedMin: 10,
    contentEn: `
# File I/O & JSON

## Opening files
\`\`\`python
# Always use 'with' — it closes the file automatically
with open("file.txt", "r") as f:
    content = f.read()         # entire file as string
    lines = f.readlines()      # list of lines
\`\`\`

## File modes
| Mode | Meaning |
|------|---------|
| \`"r"\` | Read (default) |
| \`"w"\` | Write (overwrites) |
| \`"a"\` | Append |
| \`"rb"\` | Read binary |

## Writing files
\`\`\`python
with open("output.txt", "w") as f:
    f.write("Hello\\n")
    f.writelines(["line1\\n", "line2\\n"])
\`\`\`

## Iterating line by line
\`\`\`python
with open("data.txt") as f:
    for line in f:
        print(line.strip())   # strip removes \\n
\`\`\`

## pathlib — modern way
\`\`\`python
from pathlib import Path

p = Path("data") / "scores.txt"
text = p.read_text()
p.write_text("new content")
p.exists()    # True / False
p.suffix      # ".txt"
\`\`\`

## JSON
\`\`\`python
import json

# Python → JSON string
data = {"name": "Alice", "scores": [85, 92, 78]}
text = json.dumps(data, indent=2)

# JSON string → Python
parsed = json.loads(text)
print(parsed["name"])   # Alice

# File operations
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

with open("data.json") as f:
    loaded = json.load(f)
\`\`\`

## Handling missing files
\`\`\`python
try:
    with open("config.json") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {"theme": "dark"}   # defaults
\`\`\`
    `.trim(),
    contentRu: `
# Файлы и JSON

## Открытие файлов
\`\`\`python
# Всегда используй 'with' — он закроет файл автоматически
with open("file.txt", "r") as f:
    content = f.read()         # весь файл как строка
    lines = f.readlines()      # список строк
\`\`\`

## Режимы файлов
| Режим | Значение |
|-------|---------|
| \`"r"\` | Чтение (по умолчанию) |
| \`"w"\` | Запись (перезаписывает) |
| \`"a"\` | Дозапись |
| \`"rb"\` | Бинарное чтение |

## Запись файлов
\`\`\`python
with open("output.txt", "w") as f:
    f.write("Привет\\n")
    f.writelines(["строка1\\n", "строка2\\n"])
\`\`\`

## JSON
\`\`\`python
import json

data = {"name": "Алиса", "scores": [85, 92, 78]}
text = json.dumps(data, ensure_ascii=False, indent=2)

parsed = json.loads(text)
print(parsed["name"])   # Алиса
\`\`\`
    `.trim(),
  })

  await upsertLesson(db, ch8.id, {
    slug: 'file-io-exercise',
    type: 'exercise',
    titleEn: 'Grade Aggregator',
    titleRu: 'Агрегатор оценок',
    order: 2,
    xpReward: 45,
    estimatedMin: 25,
    contentEn: 'Process a list of "name,score" records and output JSON with averages.',
    contentRu: 'Обработай список записей "имя,оценка" и выведи JSON со средними значениями.',
    exercise: {
      instructionsEn: `You have a list of grade records in \`"name,score"\` format. Write a function **aggregate(records)** that:

1. Parses each record into name and score (int)
2. Groups scores by name
3. Returns a dict with each name's **integer average** (floor)

Then print the result as JSON with sorted keys.

Expected output:
\`\`\`
{"Alice": 81, "Bob": 90}
\`\`\``,
      instructionsRu: `У тебя есть список записей оценок в формате \`"имя,оценка"\`. Напиши функцию **aggregate(records)**, которая:

1. Парсит каждую запись на имя и оценку (int)
2. Группирует оценки по именам
3. Возвращает словарь с **целым средним** (floor) для каждого имени

Затем выведи результат как JSON с отсортированными ключами.

Ожидаемый вывод:
\`\`\`
{"Alice": 81, "Bob": 90}
\`\`\``,
      starterCode: `import json

records = [
    "Alice,85",
    "Bob,92",
    "Alice,78",
    "Bob,88",
]

def aggregate(records):
    scores = {}
    for record in records:
        # split by comma, convert score to int
        pass
    # calculate averages
    return {}

result = aggregate(records)
print(json.dumps(result, sort_keys=True))
`,
      solutionCode: `import json

records = [
    "Alice,85",
    "Bob,92",
    "Alice,78",
    "Bob,88",
]

def aggregate(records):
    scores = {}
    for record in records:
        name, score = record.split(",")
        scores.setdefault(name, []).append(int(score))
    return {name: sum(v) // len(v) for name, v in scores.items()}

result = aggregate(records)
print(json.dumps(result, sort_keys=True))
`,
      language: 'python',
      timeoutMs: 5000,
      testCases: [
        { input: '', expectedOutput: '{"Alice": 81, "Bob": 90}', isHidden: false },
      ],
      hints: [
        { order: 1, textEn: 'Use record.split(",") to get [name, score]', textRu: 'Используй record.split(",") чтобы получить [имя, оценка]' },
        { order: 2, textEn: 'scores.setdefault(name, []).append(int(score)) groups scores', textRu: 'scores.setdefault(name, []).append(int(score)) группирует оценки' },
        { order: 3, textEn: 'Use sum(v) // len(v) for integer average (floor division)', textRu: 'Используй sum(v) // len(v) для целого среднего (деление с округлением)' },
      ],
    },
  })

  console.log('  ✓ Seeded Python Fundamentals course')
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function upsertChapter(
  db: PrismaClient,
  courseId: string,
  data: { slug: string; titleEn: string; titleRu: string; order: number }
) {
  return db.chapter.upsert({
    where: { courseId_slug: { courseId, slug: data.slug } },
    update: data,
    create: { courseId, ...data },
  })
}

interface LessonSeed {
  slug: string
  type: 'theory' | 'exercise' | 'quiz'
  titleEn: string
  titleRu: string
  order: number
  xpReward: number
  estimatedMin: number
  contentEn: string
  contentRu: string
  exercise?: {
    instructionsEn: string
    instructionsRu: string
    starterCode: string
    solutionCode: string
    language: string
    timeoutMs: number
    testCases: Array<{ input: string; expectedOutput: string; isHidden: boolean }>
    hints: Array<{ order: number; textEn: string; textRu: string }>
  }
  quizItems?: Array<{
    order: number
    questionEn: string
    questionRu: string
    options: Array<{ textEn: string; textRu: string; isCorrect: boolean }>
    explanation?: string
  }>
}

async function upsertLesson(db: PrismaClient, chapterId: string, data: LessonSeed) {
  const { exercise, quizItems, ...lessonData } = data

  const lesson = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug: data.slug } },
    update: { ...lessonData, isPublished: true },
    create: { chapterId, ...lessonData, isPublished: true },
  })

  if (exercise) {
    await db.exercise.upsert({
      where: { lessonId: lesson.id },
      update: exercise,
      create: { lessonId: lesson.id, ...exercise },
    })
  }

  if (quizItems) {
    for (const qi of quizItems) {
      await db.quizItem.upsert({
        where: { id: `${lesson.id}-quiz-${qi.order}` },
        update: qi,
        create: { id: `${lesson.id}-quiz-${qi.order}`, lessonId: lesson.id, ...qi },
      })
    }
  }

  return lesson
}
