import { PrismaClient } from '@prisma/client'

export async function seedJavaCourse(db: PrismaClient) {
  console.log('  Seeding Java course...')

  const course = await db.course.upsert({
    where: { slug: 'java-fundamentals' },
    update: {},
    create: {
      slug: 'java-fundamentals', language: 'java',
      titleEn: 'Java Fundamentals', titleRu: 'Основы Java',
      descriptionEn: 'Master Java — the backbone of enterprise software, Android apps, and big data. Learn OOP, classes, and the JVM from scratch.',
      descriptionRu: 'Освойте Java — основу корпоративного ПО, Android-приложений и больших данных. Изучите ООП, классы и JVM с нуля.',
      level: 1, totalXP: 360, isPublished: true,
    },
  })

  // ─── Chapter 1 ────────────────────────────────────────────────────────────
  const ch1 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-getting-started' } },
    update: {},
    create: { courseId: course.id, slug: 'java-getting-started', order: 1, titleEn: 'Getting Started with Java', titleRu: 'Начало работы с Java' },
  })

  await theory(db, ch1.id, 'what-is-java', 'What is Java?', 'Что такое Java?', 1, 10, `
# What is Java?

Java is a **statically typed, object-oriented** language released in 1995. Today maintained by Oracle.

## "Write Once, Run Anywhere"

Java compiles to **bytecode** that runs on the **JVM**. The same compiled code runs on Windows, Linux, macOS, Android.

## Where Java Is Used

- **Android apps** · **Enterprise software** (banking, insurance) · **Big Data** (Hadoop, Spark) · **Spring Boot** backends · **Minecraft**

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
| \`public class Main\` | Every Java program lives in a class |
| \`public static void main\` | JVM calls this first |
| \`System.out.println()\` | Print to console with newline |
  `.trim(), `
# Что такое Java?

Java — один из самых распространённых языков в мире. На нём написаны банковские системы, Android-приложения, Minecraft. Говорят: если Python — это дружелюбный коллега, то Java — строгий, но очень надёжный.

## Написано однажды — запускается везде

Главная идея Java: пишешь код один раз, запускаешь на любом устройстве. Java компилируется в **байт-код** который понимает **JVM** (Java Virtual Machine — виртуальная машина Java). JVM есть на Windows, Linux, macOS, Android — и везде код работает одинаково.

## Где используется Java

- **Android** — большинство Android-приложений написаны на Java или Kotlin (похож на Java)
- **Банки и страховые компании** — системы где важна надёжность
- **Minecraft** — написан на Java
- **Big Data** — Hadoop, Apache Spark
- **Бэкенды** — Spring Boot framework

## Первая программа — разбираем каждую строку

В Python вывести текст — одна строка:
\`\`\`python
print("Hello, Java!")
\`\`\`

В Java та же программа выглядит так:
\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

Объясняем по-человечески:

**\`public class Main\`** — в Java весь код живёт внутри "классов". Класс — это как контейнер или папка для кода. \`Main\` — имя класса (должно совпадать с именем файла). \`public\` означает "доступен всем".

**\`public static void main(String[] args)\`** — это специальная функция с которой Java начинает выполнение. Запомните её как магическую фразу — она всегда выглядит именно так:
- \`public\` — доступна снаружи
- \`static\` — принадлежит классу, не объекту
- \`void\` — ничего не возвращает
- \`main\` — именно это имя Java ищет при запуске
- \`String[] args\` — аргументы командной строки (пока не важно)

**\`System.out.println("Hello, Java!")\`** — вывод на экран. Читайте как: "System (компьютер) → out (канал вывода) → println (напечатать строку)". Точки разделяют уровни вложенности.

**Точка с запятой \`;\`** — каждая инструкция в Java заканчивается \`;\`. Это обязательно!

**Фигурные скобки \`{}\`** — обозначают начало и конец блока кода. Следите за парностью: каждая открывающая \`{\` должна иметь закрывающую \`}\`.

## Java vs Python: главные отличия

| | Python | Java |
|--|--------|------|
| Строгость | Мягкий | Строгий |
| Типы | Не надо указывать | Нужно указывать |
| Скобки | Отступы | Фигурные {} |
| Скорость работы | Медленнее | Быстрее |
| Где чаще | Данные, скрипты | Enterprise, Android |
  `.trim())

  await exercise(db, ch1.id, {
    slug: 'java-hello', order: 2, xpReward: 20,
    titleEn: 'Hello, Java!', titleRu: 'Привет, Java!',
    contentEn: '# Hello, Java!\n\nWrite a Java program that prints **Hello, Java!** The class must be named **Main**.',
    contentRu: `# Привет, Java!

Напишите программу которая выводит **Hello, Java!** на экран.

Структура класса уже готова — вам нужно добавить одну строку внутри \`main()\`.

В Python это было бы:
\`\`\`python
print("Hello, Java!")
\`\`\`

В Java вывод через \`System.out.println\`:
\`\`\`java
System.out.println("Hello, Java!");
\`\`\`

Добавьте эту строку вместо комментария. Не забудьте точку с запятой в конце!`,
    instructionsEn: 'Print "Hello, Java!" using System.out.println()',
    instructionsRu: 'Выведите "Hello, Java!" с помощью System.out.println()',
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Напишите здесь: System.out.println("Hello, Java!");
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Hello, Java!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use System.out.println() to print text', textRu: 'Напишите точно: System.out.println("Hello, Java!"); — заглавные S, o, p важны!' },
      { order: 2, textEn: 'System.out.println("Hello, Java!") prints the string with a newline', textRu: 'Не забудьте точку с запятой ; в конце строки — в Java это обязательно' },
    ],
  })

  // ─── Chapter 2 ────────────────────────────────────────────────────────────
  const ch2 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-variables-types' } },
    update: {},
    create: { courseId: course.id, slug: 'java-variables-types', order: 2, titleEn: 'Variables and Data Types', titleRu: 'Переменные и типы данных' },
  })

  await theory(db, ch2.id, 'java-variables-theory', 'Variables in Java', 'Переменные в Java', 1, 10, `
# Variables in Java

Java is **strongly typed** — you must declare a variable's type.

## Primitive Types

| Type | Example | Size |
|------|---------|------|
| \`int\` | \`42\` | 32-bit |
| \`long\` | \`42L\` | 64-bit |
| \`double\` | \`3.14\` | 64-bit decimal |
| \`boolean\` | \`true\` | true/false |
| \`char\` | \`'A'\` | single character |

## Declaring Variables

\`\`\`java
int age = 25;
double salary = 75000.50;
boolean isActive = true;
String name = "Alice";  // String is a class, not a primitive
\`\`\`

## var (Java 10+)

\`\`\`java
var name = "Alice";  // inferred as String
var count = 42;      // inferred as int
\`\`\`

## Constants

\`\`\`java
final double PI = 3.14159;
final int MAX_USERS = 1000;
\`\`\`
  `.trim(), `
# Переменные в Java

## Переменная — именованная коробка на полке

Переменная — это как коробка с подписью. В неё кладём значение, обращаемся по имени. Но в Java, в отличие от Python, нужно сказать что за коробка: под числа, под текст, или под логические значения.

В Python:
\`\`\`python
age = 25
name = "Дима"
is_student = True
\`\`\`

В Java:
\`\`\`java
int age = 25;
String name = "Дима";
boolean isStudent = true;
\`\`\`

**Зачем указывать тип?** Java компилируется до запуска. Компилятор проверяет типы заранее и ловит ошибки ещё до того как программа запустится. Это делает Java более надёжной для больших проектов.

## Основные типы данных

| Тип Java | Что хранит | Пример | Аналог в Python |
|----------|-----------|--------|-----------------|
| \`int\` | Целые числа | \`int age = 25;\` | \`int\` |
| \`long\` | Большие целые числа | \`long pop = 8000000000L;\` | \`int\` |
| \`double\` | Дробные числа | \`double pi = 3.14;\` | \`float\` |
| \`boolean\` | Истина/Ложь | \`boolean ok = true;\` | \`bool\` |
| \`char\` | Один символ | \`char grade = 'A';\` | нет прямого аналога |
| \`String\` | Текст | \`String name = "Дима";\` | \`str\` |

**Важно**: \`String\` пишется с заглавной буквы — это не примитивный тип, а полноценный класс. Остальные пишутся строчными.

**Важно**: \`char\` — это один символ в **одинарных** кавычках \`'A'\`. \`String\` — текст в **двойных** кавычках \`"Привет"\`.

## Три способа создать переменную

**Способ 1 — указать тип явно (классический):**
\`\`\`java
int score = 100;
String city = "Москва";
\`\`\`

**Способ 2 — объявить, потом присвоить:**
\`\`\`java
int score;         // объявили
score = 100;       // потом присвоили
\`\`\`

**Способ 3 — var (Java 10+, Java угадывает тип):**
\`\`\`java
var score = 100;    // Java видит: это int
var city = "Москва"; // Java видит: это String
\`\`\`

## Константы — final

\`\`\`java
final double PI = 3.14159;
final int MAX_USERS = 1000;
\`\`\`

Слово \`final\` означает "нельзя изменить". Если попытаться — ошибка компиляции. В Python по конвенции пишут \`UPPER_CASE\`, но это просто договорённость. В Java \`final\` — жёсткий запрет.

## Склеивание строк

В Java строки склеиваются знаком \`+\`:
\`\`\`java
String name = "Дима";
int age = 25;
System.out.println("Меня зовут " + name + ", мне " + age + " лет");
// Меня зовут Дима, мне 25 лет
\`\`\`

В Python для этого используют f-строки: \`f"Меня зовут {name}"\`. В Java современный аналог — \`String.format("Меня зовут %s", name)\`.
  `.trim())

  await exercise(db, ch2.id, {
    slug: 'java-variables-exercise', order: 2, xpReward: 25,
    titleEn: 'Working with Variables', titleRu: 'Работа с переменными',
    contentEn: '# Working with Variables\n\nDeclare `String name`, `int age`, `double gpa` with **your own values** and print them using `System.out.println()`.',
    contentRu: `# Работа с переменными

Объяви три переменные с **любыми значениями** и выведи их через \`System.out.println()\`.

Назови переменные именно так и укажи типы:
- \`String name\` — любое имя в кавычках
- \`int age\` — любое целое число
- \`double gpa\` — любое дробное число

В Java нужно указывать тип перед именем. Склейка текста и переменной — через \`+\`:
\`\`\`java
String name = "Мария";
System.out.println("Name: " + name);
\`\`\`

Формат вывода — любой, главное что значения берутся из переменных.`,
    instructionsEn: 'Declare String name, int age, double gpa with your own values and print them',
    instructionsRu: 'Объяви String name, int age, double gpa — любые значения — и выведи через System.out.println()',
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Объяви три переменные (любые значения):
        String name = "";
        int age = 0;
        double gpa = 0.0;

        // Выведи каждую через System.out.println():

    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        String name = "Maria";
        int age = 20;
        double gpa = 3.85;
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
    }
}`,
    testCases: [{ input: '', expectedOutput: '', matchType: 'non_empty', isHidden: false }],
    hints: [
      { order: 1, textEn: 'String name = "Alice"; — type comes before the variable name in Java', textRu: 'String name = "Алиса"; — тип пишется перед именем переменной. String — строка, int — целое, double — дробное' },
      { order: 2, textEn: 'System.out.println("Name: " + name) — concatenate text and variable with +', textRu: 'System.out.println("Name: " + name) — текст в кавычках и переменная соединяются знаком +' },
    ],
  })

  // ─── Chapter 3 ────────────────────────────────────────────────────────────
  const ch3 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-control-flow' } },
    update: {},
    create: { courseId: course.id, slug: 'java-control-flow', order: 3, titleEn: 'Control Flow', titleRu: 'Управление потоком' },
  })

  await theory(db, ch3.id, 'java-control-theory', 'If, Switch, and Loops', 'If, Switch и циклы', 1, 10, `
# Control Flow in Java

## If / Else

\`\`\`java
int score = 85;
if (score >= 90)      System.out.println("A");
else if (score >= 80) System.out.println("B");
else                   System.out.println("F");
\`\`\`

## Ternary

\`\`\`java
String result = score >= 60 ? "Pass" : "Fail";
\`\`\`

## Switch Expression (Java 14+)

\`\`\`java
String type = switch (day) {
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default                   -> "Weekday";
};
\`\`\`

## For Loop

\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
\`\`\`

## For-Each

\`\`\`java
int[] numbers = {10, 20, 30};
for (int num : numbers) {
    System.out.println(num);
}
\`\`\`
  `.trim(), `
# Управление потоком в Java

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

В Java то же самое, но:
- Условие в **круглых скобках** обязательно: \`if (score >= 90)\`
- Вместо двоеточия — **фигурные скобки** \`{ }\`
- \`elif\` → \`else if\` (два слова)

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

## Тернарный оператор — краткое if/else

Когда нужно выбрать одно из двух значений:
\`\`\`java
String result = score >= 60 ? "Сдал" : "Не сдал";
// читается: если score >= 60, то "Сдал", иначе "Не сдал"
\`\`\`

В Python аналог: \`result = "Сдал" if score >= 60 else "Не сдал"\`

## Цикл for — повторяем действия

**Классический for:**
\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println(i);  // выведет 0, 1, 2, 3, 4
}
\`\`\`

Три части: **начало** \`int i = 0\` | **условие** \`i < 5\` | **шаг** \`i++\`

В Python: \`for i in range(5): print(i)\`

**For-each** (как \`for item in list\` в Python):
\`\`\`java
int[] numbers = {10, 20, 30};
for (int num : numbers) {
    System.out.println(num);  // выведет 10, 20, 30
}
\`\`\`

Читается: "для каждого \`num\` из \`numbers\`".

## While — пока условие верно

\`\`\`java
int n = 1;
while (n < 100) {
    n *= 2;  // умножить n на 2
}
System.out.println(n);  // 128
\`\`\`

В Python: \`while n < 100: n *= 2\`

## Switch — быстрый выбор из вариантов

\`\`\`java
String day = "Суббота";
switch (day) {
    case "Суббота":
    case "Воскресенье":
        System.out.println("Выходной");
        break;
    default:
        System.out.println("Рабочий день");
        break;
}
\`\`\`

**Важно**: в Java нужен \`break\` после каждого варианта! Без него выполнение "проваливается" дальше.

В Java 14+ появился новый синтаксис без \`break\`:
\`\`\`java
String type = switch (day) {
    case "Суббота", "Воскресенье" -> "Выходной";
    default -> "Рабочий день";
};
\`\`\`
  `.trim())

  await exercise(db, ch3.id, {
    slug: 'java-fizzbuzz', order: 2, xpReward: 30,
    titleEn: 'FizzBuzz in Java', titleRu: 'FizzBuzz на Java',
    contentEn: '# FizzBuzz in Java\n\nPrint 1 to 20. Multiples of 3 → `Fizz`, multiples of 5 → `Buzz`, both → `FizzBuzz`.',
    contentRu: `# FizzBuzz на Java

Выведите числа от 1 до 20, но:
- Кратные 3 → напишите \`Fizz\`
- Кратные 5 → \`Buzz\`
- Кратные и 3 и 5 → \`FizzBuzz\`

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

В Java структура цикла уже написана — добавьте логику внутри.

**Знак \`%\`** — остаток от деления. \`i % 3 == 0\` значит число делится на 3 без остатка.`,
    instructionsEn: 'Use a for loop and if/else to implement FizzBuzz for 1-20',
    instructionsRu: 'Добавьте if/else внутри цикла — сначала проверяйте i % 15 == 0',
    starterCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            // Ваша логика FizzBuzz здесь
            // Подсказка: сначала проверьте i % 15 == 0
        }
    }
}`,
    solutionCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (i % 15 == 0)      System.out.println("FizzBuzz");
            else if (i % 3 == 0)  System.out.println("Fizz");
            else if (i % 5 == 0)  System.out.println("Buzz");
            else                   System.out.println(i);
        }
    }
}`,
    testCases: [{ input: '', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Check i % 15 == 0 first (divisible by both 3 and 5)', textRu: 'Сначала проверяйте i % 15 == 0 — иначе FizzBuzz никогда не сработает' },
      { order: 2, textEn: 'Then check i % 3 == 0, then i % 5 == 0', textRu: 'Числа: System.out.println(i) без кавычек. Текст: System.out.println("Fizz") в кавычках' },
    ],
  })

  // ─── Chapter 4 ────────────────────────────────────────────────────────────
  const ch4 = await db.chapter.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'java-methods-oop' } },
    update: {},
    create: { courseId: course.id, slug: 'java-methods-oop', order: 4, titleEn: 'Methods and OOP Basics', titleRu: 'Методы и основы ООП' },
  })

  await theory(db, ch4.id, 'java-methods-theory', 'Methods and Classes', 'Методы и классы', 1, 10, `
# Methods and Classes in Java

## Methods

\`\`\`java
public static int add(int a, int b) {
    return a + b;
}
int result = add(3, 4); // 7
\`\`\`

## Classes

\`\`\`java
public class Car {
    String brand;
    int year;

    public Car(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }

    public String getInfo() {
        return brand + " (" + year + ")";
    }
}

Car tesla = new Car("Tesla", 2024);
System.out.println(tesla.getInfo()); // Tesla (2024)
\`\`\`

## 4 Pillars of OOP

1. **Encapsulation** — hide internal state, expose methods
2. **Inheritance** — child classes extend parent classes
3. **Polymorphism** — one interface, multiple implementations
4. **Abstraction** — work with concepts, not details
  `.trim(), `
# Методы и классы в Java

## Методы — готовые рецепты

Метод — это именованный блок кода который можно вызывать много раз. Как рецепт: написал один раз, используй сколько угодно.

В Python:
\`\`\`python
def add(a, b):
    return a + b
\`\`\`

В Java:
\`\`\`java
public static int add(int a, int b) {
    return a + b;
}
\`\`\`

Разбираем слово за словом:
- \`public\` — метод доступен снаружи
- \`static\` — принадлежит классу, не объекту (пока просто запомните)
- \`int\` — этот метод вернёт целое число
- \`add\` — имя метода
- \`int a, int b\` — два аргумента, оба целые числа

Если метод ничего не возвращает — пишем \`void\` вместо типа:
\`\`\`java
public static void greet(String name) {
    System.out.println("Привет, " + name + "!");
    // нет return — ничего не возвращаем
}
\`\`\`

## Классы — чертежи для объектов

В Python:
\`\`\`python
class Car:
    def __init__(self, brand, year):
        self.brand = brand
        self.year = year

    def get_info(self):
        return f"{self.brand} ({self.year})"
\`\`\`

В Java:
\`\`\`java
public class Car {
    String brand;  // поля (данные)
    int year;

    public Car(String brand, int year) {  // конструктор
        this.brand = brand;  // this = текущий объект
        this.year = year;
    }

    public String getInfo() {  // метод
        return brand + " (" + year + ")";
    }
}
\`\`\`

**\`this\`** — ключевое слово означающее "этот объект". \`this.brand\` — это поле \`brand\` данного объекта. Нужно чтобы отличить поле объекта от аргумента метода с тем же именем.

Создаём объект и используем:
\`\`\`java
Car tesla = new Car("Tesla", 2024);
System.out.println(tesla.getInfo()); // Tesla (2024)
\`\`\`

**\`new\`** — создаёт новый объект в памяти. В Python \`Car("Tesla", 2024)\`, в Java нужно явно написать \`new\`.

## 4 принципа ООП — кратко

1. **Инкапсуляция** — скрывать внутренние детали. Как банкомат: вы нажимаете кнопки, не зная как он работает внутри.
2. **Наследование** — дочерний класс расширяет родительский. Электромобиль наследует всё от Автомобиль и добавляет батарею.
3. **Полиморфизм** — один интерфейс, разные реализации. Метод \`speak()\` у Кошки мяукает, у Собаки лает.
4. **Абстракция** — работать с концепцией, не деталями. Вы знаете что машина едет, не зная как работает двигатель.
  `.trim())

  await exercise(db, ch4.id, {
    slug: 'java-class-exercise', order: 2, xpReward: 40,
    titleEn: 'Create a Rectangle Class', titleRu: 'Создайте класс Rectangle',
    contentEn: '# Rectangle Class\n\nCreate `Rectangle` with `width`, `height`, `area()` (w×h), and `perimeter()` (2×(w+h)).\n\nExpected output:\n```\nArea: 15.0\nPerimeter: 16.0\n```',
    contentRu: `# Класс Rectangle

Создайте класс \`Rectangle\` (прямоугольник) с:
- Полями \`width\` (ширина) и \`height\` (высота)
- Методом \`area()\` — площадь = ширина × высота
- Методом \`perimeter()\` — периметр = 2 × (ширина + высота)

В Python это выглядело бы так:
\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)
\`\`\`

В Java класс уже объявлен — заполните конструктор и методы.

Ожидаемый вывод:
\`\`\`
Area: 15.0
Perimeter: 16.0
\`\`\``,
    instructionsEn: 'Implement a Rectangle class with area() and perimeter() methods',
    instructionsRu: 'Заполните конструктор (this.width = width) и реализуйте area() и perimeter()',
    starterCode: `public class Main {
    static class Rectangle {
        double width;
        double height;

        Rectangle(double width, double height) {
            // Сохраните width и height через this.width = width
        }

        double area() {
            return 0; // Замените на: width * height
        }

        double perimeter() {
            return 0; // Замените на: 2 * (width + height)
        }
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle(5.0, 3.0);
        System.out.println("Area: " + rect.area());
        System.out.println("Perimeter: " + rect.perimeter());
    }
}`,
    solutionCode: `public class Main {
    static class Rectangle {
        double width;
        double height;

        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }

        double area() { return width * height; }
        double perimeter() { return 2 * (width + height); }
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle(5.0, 3.0);
        System.out.println("Area: " + rect.area());
        System.out.println("Perimeter: " + rect.perimeter());
    }
}`,
    testCases: [{ input: '', expectedOutput: 'Area: 15.0\nPerimeter: 16.0', isHidden: false }],
    hints: [
      { order: 1, textEn: 'In the constructor: this.width = width; this.height = height;', textRu: 'В конструкторе: this.width = width; this.height = height; — this нужен чтобы отличить поле от аргумента' },
      { order: 2, textEn: 'area() returns width * height, perimeter() returns 2 * (width + height)', textRu: 'area() — return width * height; перimeter() — return 2 * (width + height);' },
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
