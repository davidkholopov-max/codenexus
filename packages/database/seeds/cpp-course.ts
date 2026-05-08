import { PrismaClient } from '@prisma/client'

export async function seedCppCourse(db: PrismaClient) {
  console.log('  Seeding C++ course...')

  const course = await db.course.upsert({
    where: { slug: 'cpp-fundamentals' },
    update: {},
    create: {
      slug: 'cpp-fundamentals', language: 'cpp',
      titleEn: 'C++ Fundamentals', titleRu: 'Основы C++',
      descriptionEn: 'Learn C++ — the language of game engines, operating systems, and high-performance computing. Understand memory, pointers, and low-level control.',
      descriptionRu: 'Изучите C++ — язык игровых движков, ОС и высокопроизводительных вычислений. Управление памятью, указатели и низкоуровневый контроль.',
      level: 2, totalXP: 380, isPublished: true,
    },
  })

  // ─── Chapter 1 ────────────────────────────────────────────────────────────
  const ch1 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'cpp-introduction' } },
    update: {},
    create: { courseId: course.id, slug: 'cpp-introduction', order: 1, titleEn: 'Introduction to C++', titleRu: 'Введение в C++' },
  })

  await theory(db, ch1.id, 'what-is-cpp', 'What is C++?', 'Что такое C++?', 1, 10, `
# What is C++?

C++ is a **general-purpose, compiled, statically typed** language created by Bjarne Stroustrup in 1985 as an extension of C.

## Where C++ Is Used

- **Game engines** — Unreal Engine, id Tech, CryEngine
- **Operating systems** — Windows NT kernel, parts of Linux/macOS
- **Browsers** — Chrome (V8), Firefox
- **Databases** — MySQL, MongoDB
- **High-frequency trading** — microsecond-critical systems

## Your First C++ Program

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}
\`\`\`

| Part | Meaning |
|------|---------|
| \`#include <iostream>\` | Include I/O library |
| \`int main()\` | Entry point, returns 0 = success |
| \`cout <<\` | Output to console |
| \`endl\` | Newline + flush buffer |
  `.trim(), `
# Что такое C++?

C++ — один из самых мощных языков в мире. На нём написаны операционные системы, браузеры, игровые движки и базы данных. Это как спортивный болид: нужно уметь водить, зато скорость — максимальная.

## Где используется C++

- **Игровые движки** — Unreal Engine (Fortnite, большинство AAA-игр), CryEngine
- **Операционные системы** — ядро Windows, части Linux и macOS
- **Браузеры** — Chrome, Firefox написаны на C++
- **Базы данных** — MySQL, MongoDB
- **Финансы** — системы где каждая миллисекунда стоит денег

## Первая программа — разбираем каждую строку

В Python чтобы вывести текст достаточно одной строки:
\`\`\`python
print("Hello, C++!")
\`\`\`

В C++ та же программа выглядит так:
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}
\`\`\`

Объясняем каждую строку по-человечески:

**\`#include <iostream>\`** — "подключить инструменты ввода-вывода". В Python вы пишете \`import\`, в C++ — \`#include\`. \`iostream\` — это библиотека: i (input) + o (output) + stream (поток). Без неё \`cout\` не будет работать.

**\`using namespace std;\`** — "использовать стандартное пространство имён". Представьте что все инструменты лежат в ящике с именем \`std\`. Эта строка говорит: "открой этот ящик, не заставляй меня каждый раз писать \`std::cout\` — просто \`cout\`".

**\`int main() { ... }\`** — главная функция, с которой всё начинается. \`int\` перед именем означает что функция вернёт целое число. \`return 0\` в конце — "всё прошло успешно". Если вернуть не ноль — значит была ошибка.

**\`cout << "Hello, C++!" << endl;\`** — вывод на экран. \`cout\` читается "си-аут" (C output). Стрелки \`<<\` — как конвейер: текст едет по ним к выходу. \`endl\` — перенос строки (конец линии).

**Точка с запятой \`;\`** — в C++ каждая инструкция заканчивается \`;\`. Забыть её — самая частая ошибка новичков.

## C++ vs Python: главные отличия

| Вопрос | Python | C++ |
|--------|--------|-----|
| Скорость | Медленнее | В 10-100 раз быстрее |
| Сложность | Простой | Требует внимания |
| Типы | Не нужно указывать | Нужно указывать |
| Компиляция | Нет (интерпретируется) | Да, в машинный код |
  `.trim())

  await exercise(db, ch1.id, {
    slug: 'cpp-hello', order: 2, xpReward: 20,
    titleEn: 'Hello, C++!', titleRu: 'Привет, C++!',
    contentEn: '# Hello, C++!\n\nWrite a C++ program that prints `Hello, C++!` to the console using `cout`.',
    contentRu: `# Привет, C++!

Напишите программу которая выводит \`Hello, C++!\` на экран.

Структура уже готова — вам нужно добавить одну строку внутри \`main()\`.

В Python это было бы:
\`\`\`python
print("Hello, C++!")
\`\`\`

В C++ вывод через \`cout\`:
\`\`\`cpp
cout << "Hello, C++!" << endl;
\`\`\`

Добавьте эту строку вместо комментария.`,
    instructionsEn: 'Use cout to print "Hello, C++!" with a newline',
    instructionsRu: 'Используйте cout для вывода "Hello, C++!" с переносом строки',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Напишите здесь: cout << "Hello, C++!" << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
    testCases: [{ input: '', expectedOutput: 'Hello, C++!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use: cout << "Hello, C++!" << endl;', textRu: 'Напишите точно: cout << "Hello, C++!" << endl; — знаки << обязательны' },
      { order: 2, textEn: 'endl adds a newline and flushes the buffer', textRu: 'Текст в кавычках должен совпадать точно, включая восклицательный знак' },
    ],
  })

  // ─── Chapter 2 ────────────────────────────────────────────────────────────
  const ch2 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'cpp-variables-types' } },
    update: {},
    create: { courseId: course.id, slug: 'cpp-variables-types', order: 2, titleEn: 'Variables and Types', titleRu: 'Переменные и типы' },
  })

  await theory(db, ch2.id, 'cpp-variables-theory', 'Variables and Data Types', 'Переменные и типы данных', 1, 10, `
# Variables and Data Types in C++

## Fundamental Types

\`\`\`cpp
int    age     = 25;
long   big     = 1000000000L;
double pi      = 3.14159;
float  f       = 3.14f;
bool   active  = true;
char   grade   = 'A';
\`\`\`

## Auto (C++11)

\`\`\`cpp
auto count = 42;      // int
auto pi    = 3.14;    // double
auto name  = string("Alice");
\`\`\`

## Constants

\`\`\`cpp
const double PI = 3.14159265;
constexpr int MAX = 1000; // compile-time constant
\`\`\`

## Strings

\`\`\`cpp
#include <string>
string name = "Alice";
string greeting = "Hello, " + name + "!";
int len = name.length(); // 5
\`\`\`

## Type Casting

\`\`\`cpp
double x = 9.7;
int y = static_cast<int>(x);          // 9 (truncated)
double r = static_cast<double>(7) / 2; // 3.5
\`\`\`
  `.trim(), `
# Переменные и типы в C++

## Почему C++ требует указывать тип?

В Python переменная создаётся просто:
\`\`\`python
age = 25
name = "Дима"
pi = 3.14
\`\`\`

Python сам разбирается что за данные. В C++ нужно сказать явно:
\`\`\`cpp
int    age  = 25;
string name = "Дима";
double pi   = 3.14;
\`\`\`

**Зачем это нужно?** C++ компилируется в машинный код до запуска. Компилятор должен заранее знать сколько памяти выделить под каждую переменную. \`int\` занимает 4 байта, \`double\` — 8 байт. Это делает программу очень быстрой, но требует больше аккуратности от программиста.

## Основные типы данных

| Тип | Что хранит | Пример | Аналог в Python |
|-----|-----------|--------|-----------------|
| \`int\` | Целые числа | \`int age = 25;\` | \`int\` |
| \`double\` | Дробные числа (точные) | \`double pi = 3.14;\` | \`float\` |
| \`float\` | Дробные числа (менее точные) | \`float f = 3.14f;\` | — |
| \`bool\` | Да или Нет | \`bool ok = true;\` | \`bool\` |
| \`char\` | Один символ (в одинарных кавычках!) | \`char grade = 'A';\` | — |
| \`string\` | Текст | \`string name = "Дима";\` | \`str\` |

**Важно**: \`char\` — это один символ, \`string\` — целое слово или предложение. \`char grade = 'A';\` — одинарные кавычки. \`string name = "Дима";\` — двойные кавычки.

## Auto — C++ угадывает тип сам

С C++11 можно написать \`auto\` и компилятор определит тип:
\`\`\`cpp
auto count = 42;    // компилятор поймёт: это int
auto pi    = 3.14;  // это double
auto name  = string("Дима"); // это string
\`\`\`

Это похоже на Python — но тип всё равно фиксируется при создании. Потом уже нельзя положить текст в \`int\` переменную.

## Константы — значения которые нельзя менять

\`\`\`cpp
const double PI = 3.14159265;  // нельзя изменить
const int MAX_USERS = 1000;
\`\`\`

Если попытаться изменить — компилятор выдаст ошибку. В Python по конвенции пишут \`UPPER_CASE\`, но это просто договорённость. В C++ \`const\` — это жёсткий запрет.

## Строки в C++

\`\`\`cpp
#include <string>
using namespace std;

string name = "Дима";
string greeting = "Привет, " + name + "!";  // склеивание как в Python
int length = name.length();  // длина строки
\`\`\`

Обратите внимание: нужен отдельный \`#include <string>\`. В Python строки встроены, в C++ — это отдельная библиотека.

## Приведение типов

Иногда нужно преобразовать один тип в другой:
\`\`\`cpp
double x = 9.7;
int y = static_cast<int>(x);  // y = 9 (дробная часть отбрасывается!)

int a = 7, b = 2;
double result = static_cast<double>(a) / b;  // 3.5 (а не 3!)
\`\`\`

В Python \`int(9.7)\` — в C++ \`static_cast<int>(9.7)\`. Более многословно, зато очень явно — видно что происходит преобразование.
  `.trim())

  await exercise(db, ch2.id, {
    slug: 'cpp-variables-exercise', order: 2, xpReward: 25,
    titleEn: 'Variables Practice', titleRu: 'Практика с переменными',
    contentEn: '# Variables Practice\n\nDeclare `int year`, `double version`, `string language` with **your own values** and print them using `cout`.',
    contentRu: `# Практика с переменными

Объяви три переменные с **любыми значениями** и выведи их через \`cout\`.

Назови переменные именно так и укажи типы:
- \`int year\` — любое целое число (год, версия — что угодно)
- \`double version\` — любое дробное число
- \`string language\` — любая строка в кавычках

Синтаксис вывода в C++ — цепочка стрелочек \`<<\`:
\`\`\`cpp
cout << "Year: " << year << endl;
\`\`\`
Текст → \`<<\` → переменная → \`<<\` → \`endl\` (перенос строки).

Формат вывода — любой, главное что значения берутся из переменных.`,
    instructionsEn: 'Declare int year, double version, string language with your own values and print them',
    instructionsRu: 'Объяви int year, double version, string language — любые значения — и выведи через cout',
    starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    // Объяви три переменные (любые значения):
    int year = 0;
    double version = 0.0;
    string language = "";

    // Выведи каждую через cout:

    return 0;
}`,
    solutionCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int year = 2024;
    double version = 23.0;
    string language = "C++";
    cout << "Year: " << year << endl;
    cout << "Version: " << version << endl;
    cout << "Language: " << language << endl;
    return 0;
}`,
    testCases: [{ input: '', expectedOutput: '', matchType: 'non_empty', isHidden: false }],
    hints: [
      { order: 1, textEn: 'int year = 2024; — type first, then name, then value', textRu: 'int year = 2024; — сначала тип, потом имя, потом значение. string language = "C++"; — строки в двойных кавычках' },
      { order: 2, textEn: 'cout << "Year: " << year << endl;', textRu: 'cout << "текст" << переменная << endl; — каждый кусок через стрелочки <<. endl = конец строки (Enter)' },
    ],
  })

  // ─── Chapter 3 ────────────────────────────────────────────────────────────
  const ch3 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'cpp-control-flow' } },
    update: {},
    create: { courseId: course.id, slug: 'cpp-control-flow', order: 3, titleEn: 'Control Flow', titleRu: 'Управление потоком' },
  })

  await theory(db, ch3.id, 'cpp-control-theory', 'If, Loops, and Switch', 'If, циклы и switch', 1, 10, `
# Control Flow in C++

## If / Else

\`\`\`cpp
int score = 85;
if (score >= 90)      cout << "A" << endl;
else if (score >= 80) cout << "B" << endl;
else                   cout << "F" << endl;
\`\`\`

## For Loop

\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << i << endl;
}
\`\`\`

## Range-based For (C++11)

\`\`\`cpp
int nums[] = {10, 20, 30};
for (int n : nums) {
    cout << n << endl;
}
\`\`\`

## While Loop

\`\`\`cpp
int n = 1;
while (n < 100) { n *= 2; }
cout << n << endl; // 128
\`\`\`

## Switch

\`\`\`cpp
switch (grade) {
    case 'A': cout << "Excellent"; break;
    case 'B': cout << "Good";      break;
    default:  cout << "Other";     break;
}
\`\`\`
**Important**: C++ requires \`break\` — without it, execution falls through!
  `.trim(), `
# Управление потоком в C++

## If / Else — принятие решений

В Python:
\`\`\`python
score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("F")
\`\`\`

В C++ то же самое, но:
- Условие в **круглых скобках** обязательно: \`if (score >= 90)\`
- Вместо двоеточия и отступов — **фигурные скобки** \`{ }\`
- \`elif\` → \`else if\`

\`\`\`cpp
int score = 85;
if (score >= 90) {
    cout << "A" << endl;
} else if (score >= 80) {
    cout << "B" << endl;
} else {
    cout << "F" << endl;
}
\`\`\`

## Цикл for — повторяем действие

В Python:
\`\`\`python
for i in range(5):
    print(i)  # выведет 0 1 2 3 4
\`\`\`

В C++ цикл \`for\` состоит из трёх частей через точку с запятой:
\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << i << endl;
}
\`\`\`

**Разбираем по частям**: \`int i = 0\` — начать с нуля | \`i < 5\` — продолжать пока i меньше 5 | \`i++\` — прибавлять 1 после каждого шага

## Range-based for — проходим по массиву

В C++11 появился цикл как \`for item in list\` в Python:
\`\`\`cpp
int nums[] = {10, 20, 30};
for (int n : nums) {
    cout << n << endl;
}
\`\`\`

Читается: "для каждого \`n\` из \`nums\`" — почти как Python!

## Цикл while — пока условие верно

\`\`\`cpp
int n = 1;
while (n < 100) {
    n *= 2;  // удвоить n
}
cout << n << endl;  // 128
\`\`\`

В Python аналог:
\`\`\`python
n = 1
while n < 100:
    n *= 2
print(n)
\`\`\`

## Switch — выбор из вариантов

\`\`\`cpp
char grade = 'B';
switch (grade) {
    case 'A': cout << "Отлично"; break;
    case 'B': cout << "Хорошо";  break;
    case 'C': cout << "Нормально"; break;
    default:  cout << "Другое";  break;
}
\`\`\`

**Критически важно**: в C++ нужен \`break\` после каждого варианта! Без него выполнение "проваливается" в следующий case. Это одно из главных отличий от Python/Go.
  `.trim())

  await exercise(db, ch3.id, {
    slug: 'cpp-fizzbuzz', order: 2, xpReward: 30,
    titleEn: 'FizzBuzz in C++', titleRu: 'FizzBuzz на C++',
    contentEn: '# FizzBuzz in C++\n\nPrint 1–20. Multiples of 3 → `Fizz`, 5 → `Buzz`, both → `FizzBuzz`.',
    contentRu: `# FizzBuzz на C++

Выведите числа от 1 до 20, но:
- Кратные 3 → вместо числа напишите \`Fizz\`
- Кратные 5 → \`Buzz\`
- Кратные и 3 и 5 → \`FizzBuzz\`

В Python это:
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

В C++ структура цикла уже написана — добавьте логику внутри.

**Знак \`%\`** — остаток от деления. \`i % 3 == 0\` значит "делится на 3 без остатка".`,
    instructionsEn: 'Use a for loop and if/else to implement FizzBuzz',
    instructionsRu: 'Добавьте if/else внутри цикла — сначала проверяйте i % 15 == 0',
    starterCode: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 20; i++) {
        // Ваша логика FizzBuzz здесь
        // Подсказка: сначала проверьте i % 15 == 0
    }
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 20; i++) {
        if (i % 15 == 0)      cout << "FizzBuzz" << endl;
        else if (i % 3 == 0)  cout << "Fizz" << endl;
        else if (i % 5 == 0)  cout << "Buzz" << endl;
        else                   cout << i << endl;
    }
    return 0;
}`,
    testCases: [{ input: '', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Check i % 15 == 0 first (divisible by both)', textRu: 'Сначала проверяйте i % 15 == 0 — иначе FizzBuzz никогда не сработает' },
      { order: 2, textEn: 'Don\'t forget endl after each output', textRu: 'Числа: cout << i << endl; Текст: cout << "Fizz" << endl; — не перепутайте кавычки' },
    ],
  })

  // ─── Chapter 4 ────────────────────────────────────────────────────────────
  const ch4 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'cpp-functions-pointers' } },
    update: {},
    create: { courseId: course.id, slug: 'cpp-functions-pointers', order: 4, titleEn: 'Functions and Pointers', titleRu: 'Функции и указатели' },
  })

  await theory(db, ch4.id, 'cpp-functions-theory', 'Functions and Pointers', 'Функции и указатели', 1, 10, `
# Functions and Pointers

## Functions

\`\`\`cpp
double square(double x) { return x * x; }

// Overloading
int square(int x) { return x * x; }

// Default parameters
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << "!" << endl;
}
\`\`\`

## References

\`\`\`cpp
void increment(int& n) { n++; }

int x = 5;
increment(x);
cout << x; // 6
\`\`\`

## Pointers

\`\`\`cpp
int x = 42;
int* ptr = &x;  // & = address-of

cout << x;    // 42
cout << ptr;  // memory address
cout << *ptr; // 42 — dereference

*ptr = 100;   // change x through pointer
cout << x;    // 100
\`\`\`

## Why Pointers?

- Dynamic memory (\`new\`/\`delete\`)
- Data structures (linked lists, trees)
- Passing large objects without copying
- Low-level system programming
  `.trim(), `
# Функции и указатели

## Функции — готовые рецепты

Функция — это именованный блок кода который можно вызывать много раз. Как рецепт: написал один раз, используй сколько угодно.

В Python:
\`\`\`python
def square(x):
    return x * x
\`\`\`

В C++ нужно указать тип аргумента и тип результата:
\`\`\`cpp
double square(double x) {
    return x * x;
}
\`\`\`

Читаем: "функция \`square\` принимает \`double\` (дробное число) и возвращает \`double\`".

**\`void\`** — если функция ничего не возвращает, пишем \`void\` вместо типа:
\`\`\`cpp
void greet(string name) {
    cout << "Привет, " << name << "!" << endl;
    // нет return — функция ничего не возвращает
}
\`\`\`

## Параметры по умолчанию

\`\`\`cpp
void greet(string name, string msg = "Привет") {
    cout << msg << ", " << name << "!" << endl;
}

greet("Дима");           // Привет, Дима!
greet("Саша", "Здарова"); // Здарова, Саша!
\`\`\`

В Python то же самое: \`def greet(name, msg="Привет"):\` — синтаксис почти одинаковый!

## Ссылки — передаём переменную, не копию

Обычно при вызове функции C++ копирует значение. Ссылка (\`&\`) позволяет передать саму переменную:

\`\`\`cpp
void increment(int& n) {  // & означает "ссылка на"
    n++;  // изменяем исходную переменную!
}

int x = 5;
increment(x);
cout << x;  // 6 — x изменился!
\`\`\`

Без \`&\` функция получила бы копию \`x\` и изменение не затронуло бы оригинал.

## Указатели — адреса в памяти

Указатель — это переменная которая хранит не значение, а **адрес** другой переменной в памяти.

Аналогия: представьте, что переменная — это квартира, а указатель — это листочек с адресом этой квартиры. Вы можете отдать кому-то листочек, и они смогут найти квартиру и что-то в ней изменить.

\`\`\`cpp
int x = 42;
int* ptr = &x;  // ptr хранит АДРЕС переменной x. & = "взять адрес"

cout << x;    // 42 — значение x
cout << ptr;  // адрес в памяти (типа 0x7fff5...)
cout << *ptr; // 42 — *ptr = "перейди по адресу и возьми значение"

*ptr = 100;   // изменяем значение ПО адресу
cout << x;    // 100 — x тоже изменился, это та же ячейка памяти!
\`\`\`

**Зачем нужны указатели?**
- Передавать большие объекты без копирования (экономия памяти и скорости)
- Работать с динамической памятью (\`new\`/\`delete\`)
- Строить сложные структуры данных (списки, деревья)
- Работать напрямую с железом (драйверы, ОС)

В Python и Go указателей нет явно — всё это делается автоматически. В C++ вы контролируете это сами.
  `.trim())

  await exercise(db, ch4.id, {
    slug: 'cpp-functions-exercise', order: 2, xpReward: 40,
    titleEn: 'Power Function', titleRu: 'Функция степени',
    contentEn: '# Power Function\n\nWrite `double power(double base, int exp)` that calculates `base^exp` without using `pow()`.\n\nExpected output:\n```\n2^10 = 1024\n3^4 = 81\n5^0 = 1\n```',
    contentRu: `# Функция степени

Напишите функцию \`power(base, exp)\` которая возводит число в степень без использования встроенного \`pow()\`.

В Python это выглядело бы так:
\`\`\`python
def power(base, exp):
    if exp == 0:
        return 1
    result = 1
    for i in range(exp):
        result *= base
    return result
\`\`\`

В C++ функция уже объявлена — замените \`return 0\` на правильную реализацию.

Ожидаемый вывод:
\`\`\`
2^10 = 1024
3^4 = 81
5^0 = 1
\`\`\`

**Подсказка**: любое число в степени 0 равно 1. Потом умножайте \`result\` на \`base\` ровно \`exp\` раз.`,
    instructionsEn: 'Implement power() using a loop, handle exp=0 case',
    instructionsRu: 'Реализуйте power() через цикл: начните с result=1, умножайте на base exp раз',
    starterCode: `#include <iostream>
using namespace std;

double power(double base, int exp) {
    // Если exp == 0 — вернуть 1
    // Иначе: умножить base на себя exp раз через цикл
    return 0; // TODO
}

int main() {
    cout << "2^10 = " << power(2, 10) << endl;
    cout << "3^4 = " << power(3, 4) << endl;
    cout << "5^0 = " << power(5, 0) << endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
using namespace std;

double power(double base, int exp) {
    if (exp == 0) return 1;
    double result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}

int main() {
    cout << "2^10 = " << power(2, 10) << endl;
    cout << "3^4 = " << power(3, 4) << endl;
    cout << "5^0 = " << power(5, 0) << endl;
    return 0;
}`,
    testCases: [{ input: '', expectedOutput: '2^10 = 1024\n3^4 = 81\n5^0 = 1', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Handle exp == 0 first: return 1', textRu: 'Первая строка функции: if (exp == 0) return 1;' },
      { order: 2, textEn: 'Use a loop: multiply result by base exactly exp times', textRu: 'Затем: double result = 1; и цикл for от 0 до exp, внутри result *= base;' },
    ],
  })

  console.log('  ✓ C++ course seeded')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function theory(db: PrismaClient, chapterId: string, slug: string, titleEn: string, titleRu: string, order: number, xpReward: number, contentEn: string, contentRu: string) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: { contentEn, contentRu, titleEn, titleRu },
    create: { chapterId, slug, type: 'theory', titleEn, titleRu, order, xpReward, contentEn, contentRu, isPublished: true, estimatedMin: 8 },
  })
}

interface ExData {
  slug: string; order: number; xpReward: number
  titleEn: string; titleRu: string; contentEn: string; contentRu: string
  instructionsEn: string; instructionsRu: string
  starterCode: string; solutionCode: string
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
  hints: { order: number; textEn: string; textRu: string }[]
}

async function exercise(db: PrismaClient, chapterId: string, data: ExData) {
  const { instructionsEn, instructionsRu, starterCode, solutionCode, testCases, hints, ...ld } = data
  const l = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug: data.slug } },
    update: { contentEn: ld.contentEn, contentRu: ld.contentRu, titleEn: ld.titleEn, titleRu: ld.titleRu },
    create: { chapterId, type: 'exercise', isPublished: true, estimatedMin: 15, ...ld },
  })
  await db.exercise.upsert({
    where: { lessonId: l.id },
    update: { instructionsEn, instructionsRu, starterCode, solutionCode, hints },
    create: { lessonId: l.id, instructionsEn, instructionsRu, starterCode, solutionCode, language: 'cpp', timeoutMs: 10000, testCases, hints },
  })
  return l
}
