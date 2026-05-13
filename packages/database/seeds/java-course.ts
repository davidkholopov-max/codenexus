import { PrismaClient } from '@prisma/client'

export async function seedJavaCourse(db: PrismaClient) {
  console.log('  Seeding Java course...')

  const course = await db.course.upsert({
    where: { slug: 'java-fundamentals' },
    update: {},
    create: {
      slug: 'java-fundamentals', language: 'java',
      titleEn: 'Java Fundamentals', titleRu: 'Основы Java',
      descriptionEn: 'Master Java — the backbone of enterprise software, Android apps, and big data.',
      descriptionRu: 'Освойте Java — основу корпоративного ПО, Android-приложений и больших данных.',
      level: 1, totalXP: 600, isPublished: true,
    },
  })

  // ─── Chapter 1: Getting Started ──────────────────────────────────────────
  const ch1 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-getting-started' } },
    update: {},
    create: { courseId: course.id, slug: 'java-getting-started', order: 1, titleEn: 'Getting Started with Java', titleRu: 'Начало работы с Java' },
  })

  await theory(db, ch1.id, 'what-is-java', 'What is Java?', 'Что такое Java?', 1, 10, `
# What is Java?

Java is a **statically typed, object-oriented** language. Used in Android, banking, Minecraft, and enterprise backends.

## Your First Program

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

| Part | Meaning |
|------|---------|
| \`public class Main\` | Every program lives in a class named Main |
| \`public static void main(String[] args)\` | JVM starts here — always write it exactly like this |
| \`System.out.println()\` | Print to console + newline |
| \`;\` | Every statement ends with semicolon |
| \`{}\` | Curly braces mark start and end of a block |

## print vs println

\`\`\`java
System.out.println("Hello");  // prints + newline
System.out.print("Hello");    // prints, NO newline
\`\`\`
  `.trim(), `
# Что такое Java?

Java — один из самых востребованных языков мира. На нём написаны банковские системы, Android-приложения, Minecraft.

## Структура каждой Java-программы

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Привет, Java!");
    }
}
\`\`\`

Разбираем по частям:

**\`public class Main\`** — в Java весь код живёт в "классах". \`Main\` — имя класса (совпадает с именем файла). Слово \`public\` = "виден для всех".

**\`public static void main(String[] args)\`** — это точка входа. JVM (виртуальная машина Java) запускает именно эту функцию. Запомните её как магическую фразу — пишется всегда одинаково.

**\`System.out.println("текст")\`** — вывод в консоль. Расшифровка: System (компьютер) → out (канал вывода) → println (напечатать строку и перейти на новую).

**\`;\`** — каждая инструкция заканчивается точкой с запятой. Обязательно!

**\`{ }\`** — фигурные скобки обозначают начало и конец блока. Следите: каждая \`{\` должна иметь пару \`}\`.

## println vs print

\`\`\`java
System.out.println("Привет");  // выводит + переходит на новую строку
System.out.print("Привет");    // выводит БЕЗ новой строки
\`\`\`

## Java vs Python

| | Python | Java |
|--|--------|------|
| Вывод | \`print("текст")\` | \`System.out.println("текст")\` |
| Блоки кода | Отступы | Фигурные скобки \`{}\` |
| Конец строки | Ничего | Точка с запятой \`;\` |
| Типы переменных | Сам угадывает | Нужно указывать |
  `.trim())

  await exercise(db, ch1.id, {
    slug: 'java-hello', order: 2, xpReward: 20,
    titleEn: 'Hello, Java!', titleRu: 'Привет, Java!',
    contentEn: `# Hello, Java!

Write a complete Java program that prints exactly: **Hello, Java!**

You need to write everything from scratch: the class declaration, the main method, and the print statement.

Remember:
- Class must be named \`Main\`
- The main method signature is always: \`public static void main(String[] args)\`
- Use \`System.out.println()\` to print`,
    contentRu: `# Привет, Java!

Напишите программу с нуля которая выводит: **Hello, Java!**

Вам нужно написать всё самостоятельно: объявление класса, метод main и вывод на экран.

Помните:
- Класс должен называться \`Main\`
- Сигнатура метода: \`public static void main(String[] args)\`
- Для вывода используйте \`System.out.println()\``,
    instructionsEn: 'Print "Hello, Java!" — write the full program from scratch',
    instructionsRu: 'Выведите "Hello, Java!" — напишите программу с нуля',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Hello, Java!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Start by declaring the class. Type: public class Main {', textRu: 'Начните с объявления класса. Напишите: public class Main {' },
      { order: 2, textEn: 'Inside the class, add the main method: public static void main(String[] args) {', textRu: 'Внутри класса добавьте метод: public static void main(String[] args) {' },
      { order: 3, textEn: 'Inside main, print: System.out.println("Hello, Java!"); — don\'t forget the semicolon!', textRu: 'Внутри main напишите: System.out.println("Hello, Java!"); — не забудьте точку с запятой!' },
      { order: 4, textEn: 'Close both blocks with two closing braces: } }', textRu: 'Закройте оба блока двумя фигурными скобками: } }' },
    ],
  })

  await exercise(db, ch1.id, {
    slug: 'java-multiline', order: 3, xpReward: 20,
    titleEn: 'Multiple Lines', titleRu: 'Несколько строк',
    contentEn: `# Multiple Lines

Write a Java program that prints three lines:
\`\`\`
Java is awesome
I am learning Java
Line by line
\`\`\`

Each \`println\` call prints one line and moves to the next.`,
    contentRu: `# Несколько строк

Напишите программу которая выводит три строки:
\`\`\`
Java is awesome
I am learning Java
Line by line
\`\`\`

Каждый вызов \`println\` выводит одну строку и переходит на следующую.`,
    instructionsEn: 'Print three lines: "Java is awesome", "I am learning Java", "Line by line"',
    instructionsRu: 'Выведите три строки: "Java is awesome", "I am learning Java", "Line by line"',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java is awesome");
        System.out.println("I am learning Java");
        System.out.println("Line by line");
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Java is awesome\nI am learning Java\nLine by line', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Start with: public class Main { public static void main(String[] args) {', textRu: 'Начните с: public class Main { — потом внутри: public static void main(String[] args) {' },
      { order: 2, textEn: 'Call System.out.println("Java is awesome"); — one call per line', textRu: 'Напишите System.out.println("Java is awesome"); — каждая строка — отдельный вызов println' },
      { order: 3, textEn: 'Add two more println calls for the other lines, then close with } }', textRu: 'Добавьте ещё два вызова println для остальных строк, затем закройте } }' },
    ],
  })

  await exercise(db, ch1.id, {
    slug: 'java-print-no-newline', order: 4, xpReward: 25,
    titleEn: 'Print Without Newline', titleRu: 'Вывод без переноса',
    contentEn: `# Print Without Newline

Using \`System.out.print()\` (without "ln"), print the following on **one line**:

\`Hello World\`

Use two separate print calls:
- First: print \`Hello \` (with space, no newline)
- Second: print \`World\`

This shows the difference between \`print\` and \`println\`.`,
    contentRu: `# Вывод без переноса строки

С помощью \`System.out.print()\` (без "ln") выведите следующее на **одной строке**:

\`Hello World\`

Используйте два отдельных вызова print:
- Первый: выведите \`Hello \` (с пробелом, без переноса)
- Второй: выведите \`World\`

Это показывает разницу между \`print\` и \`println\`.`,
    instructionsEn: 'Print "Hello World" on one line using two separate System.out.print() calls',
    instructionsRu: 'Выведите "Hello World" одной строкой, используя два вызова System.out.print()',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.print("Hello ");
        System.out.print("World");
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Hello World', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Declare: public class Main { public static void main(String[] args) {', textRu: 'Объявите класс и метод main как обычно' },
      { order: 2, textEn: 'Use System.out.print("Hello "); — note: print, NOT println', textRu: 'Используйте System.out.print("Hello "); — обратите внимание: print, а НЕ println' },
      { order: 3, textEn: 'Then: System.out.print("World"); — no newline after either', textRu: 'Затем: System.out.print("World"); — перенос строки не добавляется' },
    ],
  })

  // ─── Chapter 2: Variables ─────────────────────────────────────────────────
  const ch2 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-variables-types' } },
    update: {},
    create: { courseId: course.id, slug: 'java-variables-types', order: 2, titleEn: 'Variables and Data Types', titleRu: 'Переменные и типы данных' },
  })

  await theory(db, ch2.id, 'java-variables-theory', 'Variables in Java', 'Переменные в Java', 1, 10, `
# Variables in Java

Java is **strongly typed** — you must say what type each variable is.

## Primitive Types

| Type | Example | Use for |
|------|---------|---------|
| \`int\` | \`42\` | Whole numbers |
| \`double\` | \`3.14\` | Decimal numbers |
| \`boolean\` | \`true\` | True/false |
| \`char\` | \`'A'\` | Single character (single quotes!) |
| \`String\` | \`"Hello"\` | Text (double quotes) |

## Declaring and Using Variables

\`\`\`java
int age = 25;
double price = 9.99;
boolean isStudent = true;
char grade = 'A';
String name = "Alice";
\`\`\`

## String Concatenation

\`\`\`java
String name = "Alice";
int age = 25;
System.out.println("Name: " + name);       // Name: Alice
System.out.println("Age: " + age);         // Age: 25
System.out.println(name + " is " + age);   // Alice is 25
\`\`\`

## Constants

\`\`\`java
final double PI = 3.14159;  // final = cannot change
\`\`\`

## Arithmetic

\`\`\`java
int a = 10, b = 3;
System.out.println(a + b);   // 13
System.out.println(a - b);   // 7
System.out.println(a * b);   // 30
System.out.println(a / b);   // 3  (integer division!)
System.out.println(a % b);   // 1  (remainder)
\`\`\`
  `.trim(), `
# Переменные в Java

В Java вы должны явно указывать тип каждой переменной — в отличие от Python.

## Основные типы

| Тип | Пример | Для чего |
|-----|--------|----------|
| \`int\` | \`42\` | Целые числа |
| \`double\` | \`3.14\` | Числа с дробной частью |
| \`boolean\` | \`true\` | Да/нет (true/false) |
| \`char\` | \`'A'\` | Один символ (одинарные кавычки!) |
| \`String\` | \`"Привет"\` | Строка текста (двойные кавычки) |

## Объявление переменных

\`\`\`java
int age = 25;          // целое число
double price = 9.99;   // дробное число
boolean isStudent = true;  // логическое
char grade = 'A';      // один символ
String name = "Алиса"; // строка
\`\`\`

В Python: \`age = 25\` — тип не нужен. В Java: \`int age = 25;\` — тип обязателен!

## Вывод переменных через +

\`\`\`java
String name = "Алиса";
int age = 25;
System.out.println("Имя: " + name);        // Имя: Алиса
System.out.println("Возраст: " + age);     // Возраст: 25
System.out.println(name + " — " + age + " лет");  // Алиса — 25 лет
\`\`\`

Знак \`+\` между строками = склейка (конкатенация).

## Арифметика

\`\`\`java
int a = 10, b = 3;
System.out.println(a + b);   // 13
System.out.println(a - b);   // 7
System.out.println(a * b);   // 30
System.out.println(a / b);   // 3 (целочисленное деление!)
System.out.println(a % b);   // 1 (остаток от деления)
\`\`\`

Важно: \`10 / 3\` в Java = \`3\`, не \`3.33\`! Для дробного результата используйте \`double\`.
  `.trim())

  await exercise(db, ch2.id, {
    slug: 'java-variables-basic', order: 2, xpReward: 25,
    titleEn: 'Declare Variables', titleRu: 'Объявление переменных',
    contentEn: `# Declare Variables

Write a program that:
1. Creates an \`int\` variable \`age\` with value \`20\`
2. Creates a \`String\` variable \`name\` with value \`"Java"\`
3. Prints: \`Name: Java\`
4. Prints: \`Age: 20\``,
    contentRu: `# Объявление переменных

Напишите программу которая:
1. Создаёт переменную \`int\` с именем \`age\` и значением \`20\`
2. Создаёт переменную \`String\` с именем \`name\` и значением \`"Java"\`
3. Выводит: \`Name: Java\`
4. Выводит: \`Age: 20\``,
    instructionsEn: 'Declare int age=20 and String name="Java", then print them',
    instructionsRu: 'Объявите int age=20 и String name="Java", затем выведите их',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int age = 20;
        String name = "Java";
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Name: Java\nAge: 20', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Write the class and main method first: public class Main { public static void main(String[] args) {', textRu: 'Сначала напишите класс и main: public class Main { public static void main(String[] args) {' },
      { order: 2, textEn: 'Declare int: int age = 20; — the type comes first, then the name', textRu: 'Объявите int: int age = 20; — сначала тип, потом имя переменной' },
      { order: 3, textEn: 'Declare String: String name = "Java"; — String with capital S, double quotes', textRu: 'Объявите String: String name = "Java"; — String с большой буквы, двойные кавычки' },
      { order: 4, textEn: 'Print: System.out.println("Name: " + name); — the + joins the text and the variable', textRu: 'Выведите: System.out.println("Name: " + name); — знак + склеивает текст и переменную' },
    ],
  })

  await exercise(db, ch2.id, {
    slug: 'java-arithmetic', order: 3, xpReward: 25,
    titleEn: 'Simple Calculator', titleRu: 'Простой калькулятор',
    contentEn: `# Simple Calculator

Write a program that:
1. Creates \`int a = 15\` and \`int b = 4\`
2. Prints the sum: \`Sum: 19\`
3. Prints the product: \`Product: 60\`
4. Prints the remainder: \`Remainder: 3\`

Use \`+\`, \`*\`, \`%\` operators.`,
    contentRu: `# Простой калькулятор

Напишите программу которая:
1. Создаёт \`int a = 15\` и \`int b = 4\`
2. Выводит сумму: \`Sum: 19\`
3. Выводит произведение: \`Product: 60\`
4. Выводит остаток: \`Remainder: 3\`

Используйте операторы \`+\`, \`*\`, \`%\`.`,
    instructionsEn: 'Print Sum: 19, Product: 60, Remainder: 3 using a=15, b=4',
    instructionsRu: 'Выведите Sum: 19, Product: 60, Remainder: 3 используя a=15, b=4',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        System.out.println("Sum: " + (a + b));
        System.out.println("Product: " + (a * b));
        System.out.println("Remainder: " + (a % b));
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Sum: 19\nProduct: 60\nRemainder: 3', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Declare: int a = 15; and int b = 4; inside main', textRu: 'Объявите: int a = 15; и int b = 4; внутри main' },
      { order: 2, textEn: 'For sum: System.out.println("Sum: " + (a + b)); — wrap arithmetic in parentheses', textRu: 'Для суммы: System.out.println("Sum: " + (a + b)); — арифметику в скобки' },
      { order: 3, textEn: 'Product uses *: System.out.println("Product: " + (a * b));', textRu: 'Произведение через *: System.out.println("Product: " + (a * b));' },
      { order: 4, textEn: 'Remainder uses %: System.out.println("Remainder: " + (a % b));', textRu: 'Остаток через %: System.out.println("Remainder: " + (a % b));' },
    ],
  })

  await exercise(db, ch2.id, {
    slug: 'java-string-ops', order: 4, xpReward: 30,
    titleEn: 'String Operations', titleRu: 'Операции со строками',
    contentEn: `# String Operations

Write a program that:
1. Declares \`String word = "Hello"\`
2. Prints the length: \`Length: 5\` — use \`word.length()\`
3. Prints in upper case: \`Upper: HELLO\` — use \`word.toUpperCase()\`
4. Prints in lower case: \`Lower: hello\` — use \`word.toLowerCase()\``,
    contentRu: `# Операции со строками

Напишите программу которая:
1. Объявляет \`String word = "Hello"\`
2. Выводит длину: \`Length: 5\` — используйте \`word.length()\`
3. Выводит в верхнем регистре: \`Upper: HELLO\` — используйте \`word.toUpperCase()\`
4. Выводит в нижнем регистре: \`Lower: hello\` — используйте \`word.toLowerCase()\``,
    instructionsEn: 'Print length, toUpperCase, toLowerCase for the word "Hello"',
    instructionsRu: 'Выведите длину, верхний и нижний регистр для слова "Hello"',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        String word = "Hello";
        System.out.println("Length: " + word.length());
        System.out.println("Upper: " + word.toUpperCase());
        System.out.println("Lower: " + word.toLowerCase());
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Length: 5\nUpper: HELLO\nLower: hello', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Declare: String word = "Hello"; — capital S in String', textRu: 'Объявите: String word = "Hello"; — String с заглавной буквы' },
      { order: 2, textEn: 'word.length() returns the number of characters: System.out.println("Length: " + word.length());', textRu: 'word.length() возвращает количество символов: System.out.println("Length: " + word.length());' },
      { order: 3, textEn: 'word.toUpperCase() returns "HELLO": System.out.println("Upper: " + word.toUpperCase());', textRu: 'word.toUpperCase() возвращает "HELLO": System.out.println("Upper: " + word.toUpperCase());' },
    ],
  })

  // ─── Chapter 3: Control Flow ──────────────────────────────────────────────
  const ch3 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-control-flow' } },
    update: {},
    create: { courseId: course.id, slug: 'java-control-flow', order: 3, titleEn: 'Control Flow', titleRu: 'Управление потоком' },
  })

  await theory(db, ch3.id, 'java-control-flow-theory', 'Control Flow', 'Управление потоком', 1, 10, `
# Control Flow in Java

## If / Else If / Else

\`\`\`java
int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else {
    System.out.println("F");
}
\`\`\`

Key differences from Python:
- Condition must be in **parentheses**: \`if (score >= 90)\`
- Use **curly braces** \`{}\` not indentation
- \`elif\` → \`else if\` (two words)

## For Loop

\`\`\`java
// Print 0 to 4
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
\`\`\`

Three parts: **init** | **condition** | **step**

## While Loop

\`\`\`java
int n = 1;
while (n <= 5) {
    System.out.println(n);
    n++;  // n++ means n = n + 1
}
\`\`\`

## Comparison Operators

\`==\` \`!=\` \`<\` \`>\` \`<=\` \`>=\`

## Logical Operators

\`&&\` (and) · \`||\` (or) · \`!\` (not)
  `.trim(), `
# Управление потоком в Java

## If / Else If / Else

\`\`\`java
int score = 85;
if (score >= 90) {
    System.out.println("Отлично");
} else if (score >= 70) {
    System.out.println("Хорошо");
} else {
    System.out.println("Нужно подтянуться");
}
\`\`\`

Отличия от Python:
- Условие в **круглых скобках**: \`if (score >= 90)\`
- Вместо двоеточия — **фигурные скобки** \`{}\`
- \`elif\` → \`else if\` (два слова)

## Цикл for

\`\`\`java
// Выводим числа от 0 до 4
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
\`\`\`

Три части: **начало** \`int i = 0\` | **условие** \`i < 5\` | **шаг** \`i++\`

В Python: \`for i in range(5): print(i)\`

## Цикл while

\`\`\`java
int n = 1;
while (n <= 5) {
    System.out.println(n);
    n++;  // n++ это то же самое что n = n + 1
}
\`\`\`

## Операторы сравнения и логики

\`==\` \`!=\` \`<\` \`>\` \`<=\` \`>=\`

\`&&\` (и) · \`||\` (или) · \`!\` (не)
  `.trim())

  await exercise(db, ch3.id, {
    slug: 'java-if-grade', order: 2, xpReward: 30,
    titleEn: 'Grade Checker', titleRu: 'Оценщик',
    contentEn: `# Grade Checker

Write a program with \`int score = 75\` that prints the grade:
- 90 and above → \`Grade: A\`
- 75 and above → \`Grade: B\`
- 60 and above → \`Grade: C\`
- Below 60 → \`Grade: F\`

With score = 75, it should print: \`Grade: B\``,
    contentRu: `# Оценщик

Напишите программу с \`int score = 75\`, которая выводит оценку:
- 90 и выше → \`Grade: A\`
- 75 и выше → \`Grade: B\`
- 60 и выше → \`Grade: C\`
- Ниже 60 → \`Grade: F\`

При score = 75 должно выводить: \`Grade: B\``,
    instructionsEn: 'Print "Grade: B" for score=75 using if/else if/else',
    instructionsRu: 'Выведите "Grade: B" для score=75 используя if/else if/else',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int score = 75;
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 75) {
            System.out.println("Grade: B");
        } else if (score >= 60) {
            System.out.println("Grade: C");
        } else {
            System.out.println("Grade: F");
        }
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Grade: B', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Write class Main and main method, then declare: int score = 75;', textRu: 'Напишите класс Main и метод main, затем: int score = 75;' },
      { order: 2, textEn: 'Start with: if (score >= 90) { System.out.println("Grade: A"); }', textRu: 'Начните с: if (score >= 90) { System.out.println("Grade: A"); }' },
      { order: 3, textEn: 'Add: } else if (score >= 75) { System.out.println("Grade: B"); }', textRu: 'Добавьте: } else if (score >= 75) { System.out.println("Grade: B"); }' },
      { order: 4, textEn: 'Continue with else if (score >= 60) for C, then else for F', textRu: 'Продолжите с else if (score >= 60) для C, затем else для F' },
    ],
  })

  await exercise(db, ch3.id, {
    slug: 'java-for-loop', order: 3, xpReward: 30,
    titleEn: 'Count to 5', titleRu: 'Считаем до 5',
    contentEn: `# Count to 5

Write a program using a \`for\` loop that prints numbers 1 through 5, each on its own line:
\`\`\`
1
2
3
4
5
\`\`\`

Hint: start \`i\` at 1, go while \`i <= 5\`, increment with \`i++\``,
    contentRu: `# Считаем до 5

Напишите программу с циклом \`for\` которая выводит числа от 1 до 5, каждое на отдельной строке:
\`\`\`
1
2
3
4
5
\`\`\`

Подсказка: начните \`i\` с 1, условие \`i <= 5\`, шаг \`i++\``,
    instructionsEn: 'Print numbers 1 to 5 using a for loop',
    instructionsRu: 'Выведите числа от 1 до 5 используя цикл for',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
    testCases: [{ input: '', expectedOutput: '1\n2\n3\n4\n5', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Write the class and main method first', textRu: 'Сначала напишите класс Main и метод main' },
      { order: 2, textEn: 'The for loop structure: for (int i = 1; i <= 5; i++) {', textRu: 'Структура цикла: for (int i = 1; i <= 5; i++) {' },
      { order: 3, textEn: 'Inside the loop: System.out.println(i); — this prints the current value of i', textRu: 'Внутри цикла: System.out.println(i); — это выводит текущее значение i' },
      { order: 4, textEn: 'Close the loop with } and close main and class with } }', textRu: 'Закройте цикл }, затем main и класс } }' },
    ],
  })

  await exercise(db, ch3.id, {
    slug: 'java-sum-loop', order: 4, xpReward: 35,
    titleEn: 'Sum 1 to 10', titleRu: 'Сумма от 1 до 10',
    contentEn: `# Sum 1 to 10

Write a program that uses a \`for\` loop to calculate and print the sum of numbers from 1 to 10.

Output: \`Sum: 55\`

Steps:
1. Create \`int sum = 0\` before the loop
2. Loop from 1 to 10, adding each number to \`sum\`
3. After the loop, print the result`,
    contentRu: `# Сумма от 1 до 10

Напишите программу которая использует цикл \`for\` для вычисления суммы чисел от 1 до 10.

Вывод: \`Sum: 55\`

Шаги:
1. Создайте \`int sum = 0\` перед циклом
2. В цикле от 1 до 10 прибавляйте каждое число к \`sum\`
3. После цикла выведите результат`,
    instructionsEn: 'Calculate and print Sum: 55 (sum of 1 to 10) using a for loop',
    instructionsRu: 'Вычислите и выведите Sum: 55 (сумму от 1 до 10) используя цикл for',
    starterCode: ``,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum = sum + i;
        }
        System.out.println("Sum: " + sum);
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Sum: 55', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Declare int sum = 0; before the loop — this will accumulate the total', textRu: 'Объявите int sum = 0; перед циклом — в ней будем накапливать сумму' },
      { order: 2, textEn: 'Write: for (int i = 1; i <= 10; i++) {', textRu: 'Напишите: for (int i = 1; i <= 10; i++) {' },
      { order: 3, textEn: 'Inside the loop: sum = sum + i; (or shorter: sum += i;)', textRu: 'Внутри цикла: sum = sum + i; (или короче: sum += i;)' },
      { order: 4, textEn: 'After the loop (outside the }), print: System.out.println("Sum: " + sum);', textRu: 'После цикла (снаружи }): System.out.println("Sum: " + sum);' },
    ],
  })

  // ─── Chapter 4: Methods ───────────────────────────────────────────────────
  const ch4 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-methods' } },
    update: {},
    create: { courseId: course.id, slug: 'java-methods', order: 4, titleEn: 'Methods', titleRu: 'Методы' },
  })

  await theory(db, ch4.id, 'java-methods-theory', 'Methods in Java', 'Методы в Java', 1, 10, `
# Methods in Java

A method is a reusable block of code. In Java, all methods live inside a class.

## Void Method (no return value)

\`\`\`java
public class Main {
    static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greet("Alice");  // Hello, Alice!
        greet("Bob");    // Hello, Bob!
    }
}
\`\`\`

## Method That Returns a Value

\`\`\`java
static int add(int a, int b) {
    return a + b;
}

// Usage:
int result = add(3, 5);  // result = 8
System.out.println(result);
\`\`\`

## Method Anatomy

\`\`\`
static  int     add  (int a, int b)
------  ---     ---  --------------
access  return  name  parameters
        type
\`\`\`

- \`static\` — belongs to the class (required to call from main)
- Return type: \`void\` means nothing returned, \`int\` means returns an int
- Parameters go in parentheses
  `.trim(), `
# Методы в Java

Метод — это именованный блок кода который можно вызывать многократно. В Java все методы живут внутри класса.

## Метод без возвращаемого значения (void)

\`\`\`java
public class Main {
    static void greet(String name) {
        System.out.println("Привет, " + name + "!");
    }

    public static void main(String[] args) {
        greet("Алиса");  // Привет, Алиса!
        greet("Боб");    // Привет, Боб!
    }
}
\`\`\`

## Метод который возвращает значение

\`\`\`java
static int add(int a, int b) {
    return a + b;
}

// Использование:
int result = add(3, 5);  // result = 8
System.out.println(result);
\`\`\`

## Анатомия метода

\`\`\`
static  int     add  (int a, int b)
------  ---     ---  --------------
доступ  тип     имя   параметры
        возвр.
\`\`\`

- \`static\` — метод принадлежит классу (нужно для вызова из main)
- Тип возврата: \`void\` = ничего не возвращает, \`int\` = возвращает число
- Параметры идут в скобках
- \`return\` возвращает значение из метода

В Python это был бы просто: \`def add(a, b): return a + b\`
  `.trim())

  await exercise(db, ch4.id, {
    slug: 'java-method-greet', order: 2, xpReward: 35,
    titleEn: 'Greeting Method', titleRu: 'Метод приветствия',
    contentEn: `# Greeting Method

Write a program with a static method \`greet\` that:
- Takes a \`String name\` parameter
- Prints: \`Hello, [name]!\`

Call it from main with \`"World"\` so it prints:
\`Hello, World!\``,
    contentRu: `# Метод приветствия

Напишите программу со статическим методом \`greet\` который:
- Принимает параметр \`String name\`
- Выводит: \`Hello, [name]!\`

Вызовите его из main с \`"World"\` чтобы вывелось:
\`Hello, World!\``,
    instructionsEn: 'Define method greet(String name) that prints "Hello, [name]!" and call it with "World"',
    instructionsRu: 'Определите метод greet(String name) и вызовите его с "World"',
    starterCode: ``,
    solutionCode: `public class Main {
    static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greet("World");
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Hello, World!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Start with public class Main { — methods go inside the class, alongside main', textRu: 'Начните с public class Main { — методы идут внутри класса, рядом с main' },
      { order: 2, textEn: 'Define the method before main: static void greet(String name) {', textRu: 'Определите метод перед main: static void greet(String name) {' },
      { order: 3, textEn: 'Inside greet: System.out.println("Hello, " + name + "!");', textRu: 'Внутри greet: System.out.println("Hello, " + name + "!");' },
      { order: 4, textEn: 'In main, call the method: greet("World"); — just the method name with argument', textRu: 'В main вызовите метод: greet("World"); — имя метода и аргумент в скобках' },
    ],
  })

  await exercise(db, ch4.id, {
    slug: 'java-method-multiply', order: 3, xpReward: 35,
    titleEn: 'Multiply Method', titleRu: 'Метод умножения',
    contentEn: `# Multiply Method

Write a method \`multiply\` that:
- Takes two \`int\` parameters: \`a\` and \`b\`
- Returns their product (type \`int\`)

In main, call \`multiply(6, 7)\` and print the result:
\`Result: 42\``,
    contentRu: `# Метод умножения

Напишите метод \`multiply\` который:
- Принимает два параметра \`int\`: \`a\` и \`b\`
- Возвращает их произведение (тип \`int\`)

В main вызовите \`multiply(6, 7)\` и выведите результат:
\`Result: 42\``,
    instructionsEn: 'Define int multiply(int a, int b) that returns a*b, print "Result: 42"',
    instructionsRu: 'Определите int multiply(int a, int b) возвращающий a*b, выведите "Result: 42"',
    starterCode: ``,
    solutionCode: `public class Main {
    static int multiply(int a, int b) {
        return a * b;
    }

    public static void main(String[] args) {
        int result = multiply(6, 7);
        System.out.println("Result: " + result);
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Result: 42', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Define the method: static int multiply(int a, int b) { — "int" before the name means it returns an int', textRu: 'Определите метод: static int multiply(int a, int b) { — "int" перед именем означает что возвращает число' },
      { order: 2, textEn: 'Inside multiply: return a * b; — return sends the value back to the caller', textRu: 'Внутри multiply: return a * b; — return возвращает значение вызывающему' },
      { order: 3, textEn: 'In main: int result = multiply(6, 7); — store the returned value in a variable', textRu: 'В main: int result = multiply(6, 7); — сохраните возвращённое значение в переменную' },
      { order: 4, textEn: 'Print: System.out.println("Result: " + result);', textRu: 'Выведите: System.out.println("Result: " + result);' },
    ],
  })

  await exercise(db, ch4.id, {
    slug: 'java-method-max', order: 4, xpReward: 40,
    titleEn: 'Find Maximum', titleRu: 'Найти максимум',
    contentEn: `# Find Maximum

Write a method \`max\` that:
- Takes two \`int\` parameters: \`a\` and \`b\`
- Returns the larger one

In main, call \`max(12, 7)\` and print:
\`Max: 12\`

Use an \`if/else\` inside the method to decide which to return.`,
    contentRu: `# Найти максимум

Напишите метод \`max\` который:
- Принимает два параметра \`int\`: \`a\` и \`b\`
- Возвращает наибольший из них

В main вызовите \`max(12, 7)\` и выведите:
\`Max: 12\`

Используйте \`if/else\` внутри метода чтобы решить что возвращать.`,
    instructionsEn: 'Write int max(int a, int b) returning the larger value, print "Max: 12"',
    instructionsRu: 'Напишите int max(int a, int b) возвращающий большее значение, выведите "Max: 12"',
    starterCode: ``,
    solutionCode: `public class Main {
    static int max(int a, int b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    public static void main(String[] args) {
        System.out.println("Max: " + max(12, 7));
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Max: 12', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Define: static int max(int a, int b) { — returns int', textRu: 'Определите: static int max(int a, int b) { — возвращает int' },
      { order: 2, textEn: 'Inside, use if (a > b) { return a; } else { return b; }', textRu: 'Внутри используйте if (a > b) { return a; } else { return b; }' },
      { order: 3, textEn: 'In main: System.out.println("Max: " + max(12, 7));', textRu: 'В main: System.out.println("Max: " + max(12, 7));' },
    ],
  })

  console.log('  ✓ Java course seeded')
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
    create: { lessonId: l.id, instructionsEn, instructionsRu, starterCode, solutionCode, language: 'java', timeoutMs: 10000, testCases, hints },
  })
  return l
}
