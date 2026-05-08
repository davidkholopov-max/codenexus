import type { PrismaClient } from '@prisma/client'

export async function seedJavaScriptCourse(db: PrismaClient) {
  const course = await db.course.upsert({
    where: { slug: 'javascript-basics' },
    update: {},
    create: {
      slug: 'javascript-basics',
      language: 'javascript',
      titleEn: 'JavaScript for Beginners',
      titleRu: 'JavaScript для начинающих',
      descriptionEn: 'Learn the language of the web. Variables, DOM, events, async/await.',
      descriptionRu: 'Изучи язык веба. Переменные, DOM, события, async/await.',
      level: 1,
      order: 2,
      isPublished: true,
      totalXP: 600,
    },
  })

  // ─── Chapter 1: Introduction ──────────────────────────────────────────────
  const ch1 = await upsertChapter(db, course.id, 'js-intro', 'JavaScript Basics', 'Основы JavaScript', 1)

  await upsertTheory(db, ch1.id, 'what-is-js', 'What is JavaScript?', 'Что такое JavaScript?', 1, 10, `
# What is JavaScript?

JavaScript (JS) is the **programming language of the web**. It runs in every browser and makes websites interactive.

## Variables
\`\`\`javascript
let name = "Alice";    // mutable variable
const PI = 3.14;       // constant — can't change
\`\`\`

## Data types
\`\`\`javascript
let text = "hello";       // String
let num = 42;             // Number
let decimal = 3.14;       // Number (no separate float type)
let isActive = true;      // Boolean
let nothing = null;       // Null
let undef;                // Undefined
\`\`\`

## Template literals (like f-strings)
\`\`\`javascript
let name = "World";
console.log(\`Hello, \${name}!\`); // Hello, World!
\`\`\`

## Console output
\`\`\`javascript
console.log("Hello!");     // Hello!
console.log(42 + 8);      // 50
console.log(true);         // true
\`\`\`
  `.trim(), `
# Что такое JavaScript?

JavaScript (JS) — язык который оживляет сайты. Если представить сайт как куклу: **HTML** — это тело (структура), **CSS** — одежда (внешний вид), **JavaScript** — то что заставляет куклу говорить, двигаться и реагировать на вас.

JavaScript работает в браузере — не нужно ничего устанавливать, он уже там есть. Именно поэтому это самый распространённый язык в мире.

## Переменные: let, const и старый var

В Python переменные создаются просто:
\`\`\`python
name = "Алиса"  # просто присвоение
\`\`\`

В JavaScript нужно сказать какой "вид" переменной вы создаёте:

\`\`\`javascript
let name = "Алиса";    // обычная переменная — можно менять
const PI = 3.14;       // константа — нельзя изменить
\`\`\`

**Правило**: используй \`const\` по умолчанию. Переключайся на \`let\` только если нужно изменить значение. Забудь о \`var\` — это устаревший способ с неочевидным поведением.

## Типы данных

\`\`\`javascript
let text = "привет";   // String — текст в кавычках (одинарных или двойных)
let num = 42;          // Number — число (целые и дробные — одинаковый тип!)
let isActive = true;   // Boolean — true или false
let nothing = null;    // Null — намеренно пустое значение
let undef;             // Undefined — переменная объявлена, но значение не присвоено
\`\`\`

**null vs undefined** — частый вопрос. Представьте ящик стола:
- \`undefined\` — ящик есть, но вы ещё ничего в него не положили
- \`null\` — ящик есть, вы намеренно оставили его пустым (поставили заглушку "здесь пусто")

В Python нет \`undefined\` — переменные всегда инициализируются. В JS переменная без значения — \`undefined\`.

## Шаблонные строки — как f-строки в Python

В Python:
\`\`\`python
name = "Мир"
print(f"Привет, {name}!")  # Привет, Мир!
\`\`\`

В JavaScript — обратные кавычки (\`) вместо f"":
\`\`\`javascript
let name = "Мир";
console.log(\`Привет, \${name}!\`); // Привет, Мир!
\`\`\`

Обратите внимание: \`\${...}\` — доллар + фигурные скобки, не просто \`{}\`.

## Вывод в консоль

В Python \`print()\`, в JavaScript — \`console.log()\`:
\`\`\`javascript
console.log("Привет!");        // Привет!
console.log(42 + 8);           // 50
console.log("Возраст:", 25);   // Возраст: 25 (можно несколько аргументов!)
\`\`\`
  `.trim())

  await upsertExercise(db, ch1.id, 'js-hello', 'Hello JavaScript!', 'Hello JavaScript!', 2, 20, {
    en: 'Print "Hello, JavaScript!" using console.log().',
    ru: 'Выведи "Hello, JavaScript!" используя console.log().',
    starter: '// Write your code here\n',
    solution: 'console.log("Hello, JavaScript!");\n',
    lang: 'javascript',
    tests: [{ input: '', expectedOutput: 'Hello, JavaScript!', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use console.log() instead of print()', textRu: 'Используй console.log() вместо print()' },
    ],
  })

  await upsertExercise(db, ch1.id, 'js-variables', 'Variables Practice', 'Практика переменных', 3, 25, {
    en: 'Create variables firstName, age, city and print: "Name: Alice, Age: 25, City: London"',
    ru: 'Создай переменные firstName, age, city и выведи: "Name: Alice, Age: 25, City: London"',
    starter: 'const firstName = "";\nconst age = 0;\nconst city = "";\n\nconsole.log();\n',
    solution: 'const firstName = "Alice";\nconst age = 25;\nconst city = "London";\n\nconsole.log(`Name: ${firstName}, Age: ${age}, City: ${city}`);\n',
    lang: 'javascript',
    tests: [{ input: '', expectedOutput: 'Name: Alice, Age: 25, City: London', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use template literals: `Name: ${firstName}, ...`', textRu: 'Используй шаблонные строки: `Name: ${firstName}, ...`' },
    ],
  })

  // ─── Chapter 2: Control Flow ──────────────────────────────────────────────
  const ch2 = await upsertChapter(db, course.id, 'js-control-flow', 'Control Flow', 'Управляющие конструкции', 2)

  await upsertTheory(db, ch2.id, 'js-if-else', 'Conditionals', 'Условия', 1, 10, `
# Conditionals in JavaScript

\`\`\`javascript
let age = 20;

if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}
\`\`\`

## Comparison operators
\`\`\`javascript
5 === 5   // true  (strict equal — always use ===)
5 !== 3   // true
5 > 3     // true
5 <= 5    // true
\`\`\`

## Logical operators
\`\`\`javascript
true && false  // false (AND)
true || false  // true  (OR)
!true          // false (NOT)
\`\`\`

## Ternary operator
\`\`\`javascript
let status = age >= 18 ? "adult" : "minor";
\`\`\`
  `.trim(), `
# Условия и циклы в JavaScript

## If / Else — принятие решений

В Python:
\`\`\`python
age = 20
if age >= 18:
    print("Взрослый")
elif age >= 13:
    print("Подросток")
else:
    print("Ребёнок")
\`\`\`

В JavaScript: \`elif\` → \`else if\`, отступы заменяются фигурными скобками \`{}\`:
\`\`\`javascript
let age = 20;
if (age >= 18) {
  console.log("Взрослый");
} else if (age >= 13) {
  console.log("Подросток");
} else {
  console.log("Ребёнок");
}
\`\`\`

## Важно: === vs == (ловушка для новичков!)

В Python для сравнения используют \`==\`. В JavaScript есть два оператора:
- \`===\` — строгое равенство (сравнивает значение И тип) — **всегда используй это**
- \`==\` — нестрогое (пытается преобразовать типы, часто удивляет)

\`\`\`javascript
5 == "5"   // true  (число и строка — нестрого "равны"!)
5 === "5"  // false (разные типы — строго не равны)
\`\`\`

**Правило**: всегда используй \`===\` и \`!==\`. Забудь про \`==\` и \`!=\`.

## Циклы

**for — классический:**
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}
\`\`\`
\`i++\` — сокращение для \`i = i + 1\`. Три части: начало ; условие ; шаг.

**for...of — как Python's for item in list:**
\`\`\`javascript
const fruits = ["яблоко", "банан", "вишня"];
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\`

**while:**
\`\`\`javascript
let n = 1;
while (n < 100) {
  n *= 2;
}
console.log(n);  // 128
\`\`\`

## Тернарный оператор — краткое if/else

\`\`\`javascript
let status = age >= 18 ? "взрослый" : "несовершеннолетний";
// читается: если age >= 18, то "взрослый", иначе "несовершеннолетний"
\`\`\`

В Python: \`status = "взрослый" if age >= 18 else "несовершеннолетний"\`
  `.trim())

  await upsertExercise(db, ch2.id, 'js-fizzbuzz', 'FizzBuzz', 'FizzBuzz', 2, 35, {
    en: 'Print numbers 1-15. Multiples of 3: "Fizz", multiples of 5: "Buzz", both: "FizzBuzz".',
    ru: 'Выведи числа 1-15. Кратные 3: "Fizz", кратные 5: "Buzz", оба: "FizzBuzz".',
    starter: 'for (let i = 1; i <= 15; i++) {\n  // your logic here\n}\n',
    solution: 'for (let i = 1; i <= 15; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}\n',
    lang: 'javascript',
    tests: [{ input: '', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Check % 15 === 0 first for FizzBuzz', textRu: 'Сначала проверяй % 15 === 0 для FizzBuzz' },
    ],
  })

  // ─── Chapter 3: Functions ─────────────────────────────────────────────────
  const ch3 = await upsertChapter(db, course.id, 'js-functions', 'Functions', 'Функции', 3)

  await upsertTheory(db, ch3.id, 'js-functions-theory', 'Functions', 'Функции', 1, 10, `
# Functions in JavaScript

## Function declaration
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet("Alice")); // Hello, Alice!
\`\`\`

## Arrow functions (modern syntax)
\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
const square = x => x * x;  // single param: no parentheses needed
const double = x => {
  const result = x * 2;
  return result;             // block body: needs return
};
\`\`\`

## Default parameters
\`\`\`javascript
function power(base, exp = 2) {
  return base ** exp;
}
power(3);    // 9
power(2, 8); // 256
\`\`\`

## Higher-order functions
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);    // [2, 4, 6, 8, 10]
const evens   = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum     = numbers.reduce((acc, n) => acc + n, 0); // 15
\`\`\`
  `.trim(), `
# Функции в JavaScript

## Три способа объявить функцию

**Способ 1 — обычное объявление (как def в Python):**
\`\`\`javascript
function greet(name) {
  return \`Привет, \${name}!\`;
}
console.log(greet("Алиса")); // Привет, Алиса!
\`\`\`

**Способ 2 — функция-выражение (переменная = функция):**
\`\`\`javascript
const greet = function(name) {
  return \`Привет, \${name}!\`;
};
\`\`\`

**Способ 3 — стрелочная функция (современный, краткий):**
\`\`\`javascript
const greet = (name) => \`Привет, \${name}!\`;
\`\`\`

Стрелочная функция — как Python's \`lambda\`, но гораздо мощнее. Если тело одна строка — \`return\` не нужен, фигурные скобки не нужны.

**Важно**: если тело несколько строк — нужны \`{}\` И явный \`return\`:
\`\`\`javascript
const double = x => {
  const result = x * 2;
  return result;  // без return — вернёт undefined!
};
\`\`\`

## Параметры по умолчанию — как в Python

\`\`\`javascript
function power(base, exp = 2) {
  return base ** exp;  // ** это степень
}
power(3);     // 9 (exp = 2 по умолчанию)
power(2, 8);  // 256
\`\`\`

В Python: \`def power(base, exp=2): return base ** exp\` — синтаксис почти одинаковый!

## Функции как аргументы — коллбэки

В JavaScript функции можно передавать как аргументы другим функциям. Это называется "коллбэк" (callback).

Аналогия: вы оставили официанту записку "когда приготовят — принеси". Официант выполнит вашу инструкцию (коллбэк) когда будет готово.

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Передаём стрелочную функцию как аргумент:
const doubled = numbers.map(n => n * 2);   // [2, 4, 6, 8, 10]
const evens   = numbers.filter(n => n % 2 === 0); // [2, 4]
const sum     = numbers.reduce((acc, n) => acc + n, 0); // 15
\`\`\`

В Python аналоги: \`list(map(lambda n: n*2, numbers))\` и \`list(filter(...))\`. В JS это намного удобнее.
  `.trim())

  await upsertExercise(db, ch3.id, 'js-array-ops', 'Array Operations', 'Операции с массивами', 2, 40, {
    en: 'Given numbers = [1,2,3,4,5,6,7,8,9,10], using map/filter/reduce print:\n1. Sum of all numbers\n2. Array of even numbers doubled\nExample: "55" then "[4,8,12,16,20]"',
    ru: 'Дан numbers = [1,2,3,4,5,6,7,8,9,10], используя map/filter/reduce выведи:\n1. Сумму всех чисел\n2. Массив чётных чисел, умноженных на 2',
    starter: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// 1. Sum of all numbers\nconst sum = \nconsole.log(sum);\n\n// 2. Even numbers doubled\nconst result = \nconsole.log(JSON.stringify(result));\n',
    solution: 'const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\nconst sum = numbers.reduce((acc, n) => acc + n, 0);\nconsole.log(sum);\n\nconst result = numbers.filter(n => n % 2 === 0).map(n => n * 2);\nconsole.log(JSON.stringify(result));\n',
    lang: 'javascript',
    tests: [{ input: '', expectedOutput: '55\n[4,8,12,16,20]', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use .reduce((acc, n) => acc + n, 0) for sum', textRu: 'Используй .reduce((acc, n) => acc + n, 0) для суммы' },
      { order: 2, textEn: 'Chain .filter().map() for even doubled', textRu: 'Цепляй .filter().map() для чётных удвоенных' },
    ],
  })

  // ─── Chapter 4: Arrays & Objects ─────────────────────────────────────────
  const ch4 = await upsertChapter(db, course.id, 'js-arrays-objects', 'Arrays & Objects', 'Массивы и объекты', 4)

  await upsertTheory(db, ch4.id, 'js-objects', 'Objects', 'Объекты', 1, 10, `
# Objects in JavaScript

Objects store key-value pairs — like a dictionary.

\`\`\`javascript
const user = {
  name: "Alice",
  age: 25,
  city: "London",
  isActive: true,
};

console.log(user.name);       // Alice
console.log(user["age"]);     // 25
user.email = "alice@example.com"; // add property
\`\`\`

## Destructuring
\`\`\`javascript
const { name, age } = user;
console.log(name, age); // Alice 25
\`\`\`

## Spread operator
\`\`\`javascript
const updated = { ...user, age: 26 }; // copy + override
\`\`\`

## Object methods
\`\`\`javascript
Object.keys(user)    // ["name", "age", "city", "isActive"]
Object.values(user)  // ["Alice", 25, "London", true]
Object.entries(user) // [["name", "Alice"], ["age", 25], ...]
\`\`\`
  `.trim(), `
# Объекты и массивы в JavaScript

## Объект — как словарь в Python

В Python словарь:
\`\`\`python
user = {
    "name": "Алиса",
    "age": 25,
    "city": "Москва",
}
print(user["name"])  # Алиса
\`\`\`

В JavaScript объект — почти то же самое, но:
- Ключи **без кавычек** (можно и с ними, но обычно без)
- Обращение через **точку** или через **скобки**

\`\`\`javascript
const user = {
  name: "Алиса",
  age: 25,
  city: "Москва",
};

console.log(user.name);      // Алиса  — через точку
console.log(user["age"]);    // 25     — через скобки (как Python)
user.email = "a@mail.ru";   // добавить новое свойство
\`\`\`

Когда использовать \`user["key"]\` вместо \`user.key\`? Когда имя ключа — в переменной:
\`\`\`javascript
const field = "name";
console.log(user[field]);  // Алиса — динамический ключ
\`\`\`

## Массив — как список в Python

\`\`\`javascript
const fruits = ["яблоко", "банан", "вишня"];
fruits.push("дыня");    // добавить в конец (как append)
fruits.pop();           // удалить последний
fruits.unshift("виноград"); // добавить в начало
fruits.shift();         // удалить первый

console.log(fruits.length); // длина
console.log(fruits[0]);     // первый элемент
\`\`\`

## Деструктуризация — извлекаем сразу несколько значений

\`\`\`javascript
// Объект
const { name, age } = user;
console.log(name, age); // Алиса 25

// Можно переименовать:
const { name: userName } = user;
console.log(userName); // Алиса

// Массив
const [first, second, ...rest] = fruits;
console.log(first);  // яблоко
console.log(rest);   // ["вишня", ...]
\`\`\`

## Spread — "разворачиваем" массив или объект

\`\`\`javascript
// Копируем объект и меняем одно поле (оригинал НЕ меняется)
const updatedUser = { ...user, age: 26 };

// Объединяем массивы
const nums1 = [1, 2, 3];
const nums2 = [4, 5, 6];
const all = [...nums1, ...nums2]; // [1, 2, 3, 4, 5, 6]
\`\`\`

## Object.keys / .values / .entries

\`\`\`javascript
Object.keys(user)    // ["name", "age", "city"] — все ключи
Object.values(user)  // ["Алиса", 25, "Москва"] — все значения
Object.entries(user) // [["name","Алиса"], ["age",25], ...] — пары
\`\`\`

В Python аналоги: \`dict.keys()\`, \`dict.values()\`, \`dict.items()\`.
  `.trim())

  await upsertExercise(db, ch4.id, 'js-objects-exercise', 'Student Report', 'Отчёт ученика', 2, 45, {
    en: 'Create a student object with name, grades (array), and a method getAverage(). Print: "Alice: 88.00"',
    ru: 'Создай объект student с name, grades (массив) и методом getAverage(). Выведи: "Alice: 88.00"',
    starter: 'const student = {\n  name: "Alice",\n  grades: [85, 92, 78, 95, 90],\n  getAverage() {\n    // return average of grades\n  }\n};\n\nconst avg = student.getAverage();\nconsole.log(`${student.name}: ${avg.toFixed(2)}`);\n',
    solution: 'const student = {\n  name: "Alice",\n  grades: [85, 92, 78, 95, 90],\n  getAverage() {\n    return this.grades.reduce((sum, g) => sum + g, 0) / this.grades.length;\n  }\n};\n\nconst avg = student.getAverage();\nconsole.log(`${student.name}: ${avg.toFixed(2)}`);\n',
    lang: 'javascript',
    tests: [{ input: '', expectedOutput: 'Alice: 88.00', isHidden: false }],
    hints: [
      { order: 1, textEn: 'Use this.grades inside the method to access grades', textRu: 'Используй this.grades внутри метода для доступа к оценкам' },
      { order: 2, textEn: 'Sum with reduce, divide by this.grades.length', textRu: 'Сложи через reduce, раздели на this.grades.length' },
    ],
  })

  // ─── Chapter 5: ES6+ Features ────────────────────────────────────────────────
  const ch5 = await upsertChapter(db, course.id, 'js-es6', 'Modern JavaScript (ES6+)', 'Современный JavaScript (ES6+)', 5)

  await upsertTheory(db, ch5.id, 'js-es6-features', 'Destructuring, Spread & More', 'Деструктуризация, Spread и другое', 1, 15, `
# Modern JavaScript (ES6+)

## Destructuring
\`\`\`javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(rest);   // [3, 4, 5]

// Object destructuring
const { name, age, city = "Unknown" } = { name: "Alice", age: 25 };
console.log(name);   // Alice
console.log(city);   // Unknown (default value)
\`\`\`

## Spread & Rest operators
\`\`\`javascript
// Spread — expand an array/object
const nums = [1, 2, 3];
const more = [...nums, 4, 5];      // [1, 2, 3, 4, 5]
const copy = { ...user, age: 26 }; // shallow clone + override

// Rest — collect remaining args
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10
\`\`\`

## Optional chaining ?.
\`\`\`javascript
const user = { profile: { avatar: "pic.jpg" } };
console.log(user?.profile?.avatar);  // "pic.jpg"
console.log(user?.address?.city);    // undefined (no error!)
\`\`\`

## Nullish coalescing ??
\`\`\`javascript
const name = null ?? "Guest";   // "Guest"
const count = 0 ?? 10;          // 0   (0 is not null/undefined)
const text = "" || "default";   // "default" (|| treats "" as falsy)
\`\`\`

## Modules (import/export)
\`\`\`javascript
// math.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function cube(x) { return x ** 3; }

// main.js
import cube, { PI, square } from './math.js';
\`\`\`
  `.trim(), `
# Современный JavaScript (ES6+)

## Optional chaining ?. — обращение без страха

Представьте: у пользователя может не быть профиля, а у профиля — аватара.

**Раньше приходилось писать:**
\`\`\`javascript
const avatar = user && user.profile && user.profile.avatar;
\`\`\`

**Теперь с ?. :**
\`\`\`javascript
const avatar = user?.profile?.avatar;
// Если user или profile не существуют — вернёт undefined, не ошибку
\`\`\`

## ?? vs || — ещё одна ловушка

**\`||\`** (или) возвращает правое значение если левое "ложное". В JavaScript "ложными" считаются: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`.

**\`??\`** (нулевое слияние) возвращает правое значение только если левое \`null\` или \`undefined\`.

\`\`\`javascript
const count = 0 || 10;   // 10 — потому что 0 "ложное"! Неожиданно?
const count = 0 ?? 10;   // 0  — 0 не null/undefined, берём его
const name = "" || "Гость";  // "Гость" — пустая строка "ложная"
const name = "" ?? "Гость";  // ""      — пустая строка не null
\`\`\`

**Правило**: если хотите "значение по умолчанию когда нет данных" — используйте \`??\`. \`||\` для логики да/нет.

## Rest — "и остальные"

Rest (\`...args\`) — в параметрах функции означает "собери все оставшиеся аргументы в массив":
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10 — принимает любое количество аргументов
\`\`\`

В Python аналог: \`def sum(*numbers)\`.

## Классы — как в Python

В Python:
\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} говорит!"
\`\`\`

В JavaScript:
\`\`\`javascript
class Animal {
  constructor(name) {   // __init__ → constructor
    this.name = name;   // self → this
  }
  speak() {
    return \`\${this.name} говорит!\`;
  }
}
const cat = new Animal("Мурка");
console.log(cat.speak()); // Мурка говорит!
\`\`\`

## Модули — импорт и экспорт

В Python: \`from math import pi, sqrt\`
В JavaScript: \`import { PI, square } from './math.js'\`

\`\`\`javascript
// math.js — экспортируем
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function cube(x) { return x ** 3; }  // экспорт по умолчанию

// main.js — импортируем
import cube from './math.js';          // импорт по умолчанию
import { PI, square } from './math.js'; // именованный импорт
\`\`\`
  `.trim())

  await upsertExercise(db, ch5.id, 'js-es6-exercise', 'Reshape User Data', 'Преобразование данных пользователя', 2, 40, {
    en: 'Use destructuring and spread to extract and transform user objects. Print the formatted string.',
    ru: 'Используй деструктуризацию и spread для извлечения и преобразования объектов пользователей.',
    starter: `const users = [
  { id: 1, name: "Alice", age: 25, role: "admin" },
  { id: 2, name: "Bob", age: 30, role: "user" },
  { id: 3, name: "Charlie", age: 22, role: "user" },
];

// Destructure and transform each user:
// - extract name, age, role (ignore id)
// - add a label: "admin" → "Admin", otherwise "Member"
// - print: "Alice (25) - Admin"
users.forEach(user => {
  const { name, age, role } = user;
  // your code here
});
`,
    solution: `const users = [
  { id: 1, name: "Alice", age: 25, role: "admin" },
  { id: 2, name: "Bob", age: 30, role: "user" },
  { id: 3, name: "Charlie", age: 22, role: "user" },
];

users.forEach(({ name, age, role }) => {
  const label = role === "admin" ? "Admin" : "Member";
  console.log(\`\${name} (\${age}) - \${label}\`);
});
`,
    lang: 'javascript',
    tests: [
      { input: '', expectedOutput: 'Alice (25) - Admin\nBob (30) - Member\nCharlie (22) - Member', isHidden: false },
    ],
    hints: [
      { order: 1, textEn: 'Destructure directly in the forEach parameter: ({ name, age, role })', textRu: 'Деструктурируй прямо в параметре forEach: ({ name, age, role })' },
      { order: 2, textEn: 'Use a ternary: role === "admin" ? "Admin" : "Member"', textRu: 'Используй тернарник: role === "admin" ? "Admin" : "Member"' },
    ],
  })

  // ─── Chapter 6: Promises & async/await ───────────────────────────────────────
  const ch6 = await upsertChapter(db, course.id, 'js-async', 'Promises & async/await', 'Промисы и async/await', 6)

  await upsertTheory(db, ch6.id, 'js-promises-theory', 'Async JavaScript', 'Асинхронный JavaScript', 1, 15, `
# Promises & async/await

## Why async?
JavaScript is **single-threaded** but non-blocking. Async code lets you wait for slow operations (network, disk) without freezing the app.

## Promises
\`\`\`javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done!"), 1000);
});

p.then(result => console.log(result))  // "done!"
 .catch(err => console.error(err));
\`\`\`

## async/await — cleaner syntax
\`\`\`javascript
async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Failed:", err);
  }
}
\`\`\`

## Promise.all — run in parallel
\`\`\`javascript
const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);
\`\`\`
  `.trim(), `
# Промисы и async/await

## Зачем async? Однопоточность без зависания

JavaScript работает в одном потоке. Представьте повара который готовит один: пока варится суп — он не стоит и ждёт, а режет овощи. Когда таймер зазвенит — возвращается к супу.

Асинхронный код — та же идея: пока ждём ответа от сервера, браузер не "зависает", а продолжает работу.

## Промисы — "обещание" получить данные потом

Промис (Promise) — как квитанция из химчистки. Вы сдаёте одежду и получаете квитанцию. Позже придёте и заберёте — либо готовую одежду (resolve), либо вам скажут что-то пошло не так (reject).

У промиса три состояния:
- **pending** — ещё в процессе, результата нет
- **fulfilled** — выполнен успешно, есть результат
- **rejected** — произошла ошибка

\`\`\`javascript
const p = new Promise((resolve, reject) => {
  // resolve — вызвать когда всё хорошо
  // reject  — вызвать при ошибке
  setTimeout(() => resolve("готово!"), 1000);
});

p.then(result => console.log(result))  // когда resolve — "готово!"
 .catch(err => console.error(err));    // когда reject — ошибка
\`\`\`

## async/await — читаем асинхронный код как обычный

\`\`\`javascript
// Python asyncio аналог:
// async def load_user(id):
//     res = await fetch(...)
//     return await res.json()

async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);  // ждём ответ сервера
    const user = await res.json();                   // ждём разбор JSON
    return user;
  } catch (err) {
    console.error("Ошибка:", err);  // что-то пошло не так
  }
}
\`\`\`

\`await\` останавливает выполнение **внутри функции** (не весь браузер!), ждёт промиса и возвращает результат.

**\`async\` функция всегда возвращает промис** — даже если внутри return простое значение.

## Promise.all — параллельно, не последовательно

\`\`\`javascript
// Последовательно — 2 секунды (ждём первого, потом второго):
const users = await fetchUsers();    // 1 сек
const posts = await fetchPosts();    // 1 сек

// Параллельно — 1 секунда (оба запроса одновременно):
const [users, posts] = await Promise.all([
  fetchUsers(),   // запускаем оба
  fetchPosts(),   // одновременно
]);
\`\`\`

Используйте \`Promise.all\` когда запросы независимы друг от друга.
  `.trim())

  await upsertExercise(db, ch6.id, 'js-promises-exercise', 'Promise Chain', 'Цепочка промисов', 2, 45, {
    en: 'Work with Promises: create, chain, and handle errors.',
    ru: 'Работа с промисами: создание, цепочка и обработка ошибок.',
    starter: `// Simulate async operations with Promise.resolve / Promise.reject

function getUser(id) {
  if (id <= 0) return Promise.reject(new Error("Invalid ID"));
  return Promise.resolve({ id, name: "Alice", score: 85 });
}

function getBonus(score) {
  return Promise.resolve(score >= 80 ? "Gold" : "Silver");
}

// Chain getUser(1) → getBonus(user.score) → print "Alice: Gold"
// Chain getUser(-1) → catch error → print "Error: Invalid ID"

// Your code here
`,
    solution: `function getUser(id) {
  if (id <= 0) return Promise.reject(new Error("Invalid ID"));
  return Promise.resolve({ id, name: "Alice", score: 85 });
}

function getBonus(score) {
  return Promise.resolve(score >= 80 ? "Gold" : "Silver");
}

getUser(1)
  .then(user => getBonus(user.score).then(bonus => console.log(\`\${user.name}: \${bonus}\`)))
  .catch(err => console.log(\`Error: \${err.message}\`));

getUser(-1)
  .then(user => getBonus(user.score).then(bonus => console.log(\`\${user.name}: \${bonus}\`)))
  .catch(err => console.log(\`Error: \${err.message}\`));
`,
    lang: 'javascript',
    tests: [
      { input: '', expectedOutput: 'Alice: Gold\nError: Invalid ID', isHidden: false },
    ],
    hints: [
      { order: 1, textEn: 'Chain .then() after getUser(1) to receive the user object', textRu: 'Прицепи .then() после getUser(1) чтобы получить объект пользователя' },
      { order: 2, textEn: 'Return getBonus(user.score) inside .then() to continue the chain', textRu: 'Верни getBonus(user.score) внутри .then() чтобы продолжить цепочку' },
      { order: 3, textEn: 'Use .catch(err => ...) to handle getUser(-1) rejection', textRu: 'Используй .catch(err => ...) для обработки отклонения getUser(-1)' },
    ],
  })

  // ─── Chapter 7: Array Methods ─────────────────────────────────────────────────
  const ch7 = await upsertChapter(db, course.id, 'js-array-methods', 'Functional Array Methods', 'Функциональные методы массивов', 7)

  await upsertTheory(db, ch7.id, 'js-array-methods-theory', 'map, filter, reduce & more', 'map, filter, reduce и другое', 1, 15, `
# Functional Array Methods

These methods **don't mutate** the original array — they return a new one.

## map — transform each element
\`\`\`javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);   // [2, 4, 6, 8]
const names = users.map(u => u.name);   // ["Alice", "Bob"]
\`\`\`

## filter — keep elements matching condition
\`\`\`javascript
const evens = nums.filter(n => n % 2 === 0);       // [2, 4]
const adults = users.filter(u => u.age >= 18);
\`\`\`

## reduce — accumulate into a single value
\`\`\`javascript
const sum = nums.reduce((acc, n) => acc + n, 0);   // 10
const max = nums.reduce((a, b) => a > b ? a : b);  // 4
\`\`\`

## find & findIndex
\`\`\`javascript
const user = users.find(u => u.id === 3);          // first match
const idx  = users.findIndex(u => u.id === 3);     // index or -1
\`\`\`

## some & every
\`\`\`javascript
nums.some(n => n > 3);    // true  (at least one)
nums.every(n => n > 0);   // true  (all match)
\`\`\`

## Chaining methods
\`\`\`javascript
const result = users
  .filter(u => u.age >= 18)
  .map(u => u.name.toUpperCase())
  .sort();
\`\`\`

## forEach — side effects only (no return value)
\`\`\`javascript
users.forEach(u => console.log(u.name));
// Use map when you need the result, forEach when you don't
\`\`\`
  `.trim(), `
# Функциональные методы массивов

Все эти методы **не меняют** исходный массив — они возвращают новый. Это важно!

## map — преобразуем каждый элемент

В Python: \`list(map(lambda n: n*2, nums))\`
В JavaScript:
\`\`\`javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);  // [2, 4, 6, 8]
const names = users.map(u => u.name);  // ["Алиса", "Боб", ...]
\`\`\`

\`map\` проходит по каждому элементу, применяет функцию, собирает результаты в новый массив.

## filter — оставляем только нужные

В Python: \`list(filter(lambda n: n % 2 == 0, nums))\`
\`\`\`javascript
const evens = nums.filter(n => n % 2 === 0);  // [2, 4]
const adults = users.filter(u => u.age >= 18);
\`\`\`

## reduce — сворачиваем в одно значение

Самый мощный и поначалу непонятный метод. \`acc\` — накопитель, \`n\` — текущий элемент, \`0\` — начальное значение накопителя.

\`\`\`javascript
const nums = [1, 2, 3, 4];
// Шаг 1: acc=0, n=1 → 0+1=1
// Шаг 2: acc=1, n=2 → 1+2=3
// Шаг 3: acc=3, n=3 → 3+3=6
// Шаг 4: acc=6, n=4 → 6+4=10
const sum = nums.reduce((acc, n) => acc + n, 0);  // 10
\`\`\`

В Python: \`from functools import reduce; reduce(lambda a, b: a+b, nums, 0)\`

## find — ищем первое совпадение

\`\`\`javascript
const user = users.find(u => u.id === 3);         // объект или undefined
const idx  = users.findIndex(u => u.id === 3);    // индекс или -1
\`\`\`

В Python: \`next((u for u in users if u["id"] == 3), None)\`

## some и every — проверяем условие

\`\`\`javascript
nums.some(n => n > 3);    // true — хотя бы один больше 3
nums.every(n => n > 0);   // true — все больше 0
\`\`\`

В Python: \`any(n > 3 for n in nums)\` и \`all(n > 0 for n in nums)\`

## Цепочка методов — всё вместе

Методы можно цеплять один за другим:
\`\`\`javascript
const result = users
  .filter(u => u.age >= 18)         // только совершеннолетние
  .map(u => u.name.toUpperCase())   // имена заглавными
  .sort();                           // сортируем

// Это как список включений в Python:
// [u["name"].upper() for u in users if u["age"] >= 18]
\`\`\`

## forEach vs map — что выбрать?

- **map** — когда нужен новый массив с результатами
- **forEach** — когда нужно выполнить действие (вывести, записать в БД), результат не важен

\`\`\`javascript
users.forEach(u => console.log(u.name));  // просто выводим — нет нового массива
\`\`\`
  `.trim())

  await upsertExercise(db, ch7.id, 'js-array-methods-exercise', 'Sales Report', 'Отчёт о продажах', 2, 45, {
    en: 'Use map, filter, and reduce to process sales data and generate a report.',
    ru: 'Используй map, filter и reduce для обработки данных о продажах.',
    starter: `const sales = [
  { product: "Laptop", category: "Electronics", amount: 1200, qty: 3 },
  { product: "Phone",  category: "Electronics", amount: 800,  qty: 5 },
  { product: "Desk",   category: "Furniture",   amount: 350,  qty: 2 },
  { product: "Chair",  category: "Furniture",   amount: 150,  qty: 8 },
  { product: "Tablet", category: "Electronics", amount: 600,  qty: 4 },
];

// 1. Total revenue (amount * qty for each item, then sum)
const totalRevenue = 0; // your code

// 2. Electronics only — list of product names, sorted A-Z
const electronics = []; // your code

// 3. Most expensive product name
const priciest = ""; // your code

console.log(totalRevenue);        // 11800
console.log(electronics.join(", ")); // Laptop, Phone, Tablet
console.log(priciest);            // Laptop
`,
    solution: `const sales = [
  { product: "Laptop", category: "Electronics", amount: 1200, qty: 3 },
  { product: "Phone",  category: "Electronics", amount: 800,  qty: 5 },
  { product: "Desk",   category: "Furniture",   amount: 350,  qty: 2 },
  { product: "Chair",  category: "Furniture",   amount: 150,  qty: 8 },
  { product: "Tablet", category: "Electronics", amount: 600,  qty: 4 },
];

const totalRevenue = sales.reduce((sum, s) => sum + s.amount * s.qty, 0);

const electronics = sales
  .filter(s => s.category === "Electronics")
  .map(s => s.product)
  .sort();

const priciest = sales.reduce((max, s) => s.amount > max.amount ? s : max).product;

console.log(totalRevenue);
console.log(electronics.join(", "));
console.log(priciest);
`,
    lang: 'javascript',
    tests: [
      { input: '', expectedOutput: '11800\nLaptop, Phone, Tablet\nLaptop', isHidden: false },
    ],
    hints: [
      { order: 1, textEn: 'For totalRevenue: reduce with (sum, s) => sum + s.amount * s.qty, starting at 0', textRu: 'Для totalRevenue: reduce с (sum, s) => sum + s.amount * s.qty, начиная с 0' },
      { order: 2, textEn: 'For electronics: filter by category, then map to product names, then sort()', textRu: 'Для electronics: filter по category, потом map на имена, потом sort()' },
      { order: 3, textEn: 'For priciest: reduce comparing s.amount to find the max, return .product at the end', textRu: 'Для priciest: reduce сравнивая s.amount, в конце верни .product' },
    ],
  })

  console.log('  ✓ Seeded JavaScript course (7 chapters)')
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function upsertChapter(db: PrismaClient, courseId: string, slug: string, titleEn: string, titleRu: string, order: number) {
  return db.chapter.upsert({
    where: { courseId_slug: { courseId, slug } },
    update: {},
    create: { courseId, slug, titleEn, titleRu, order },
  })
}

async function upsertTheory(
  db: PrismaClient,
  chapterId: string,
  slug: string,
  titleEn: string,
  titleRu: string,
  order: number,
  xpReward: number,
  contentEn: string,
  contentRu: string
) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: { contentEn, contentRu, titleEn, titleRu },
    create: {
      chapterId, slug, type: 'theory', titleEn, titleRu,
      order, xpReward, estimatedMin: 8, isPublished: true,
      contentEn, contentRu,
    },
  })
}

interface ExerciseData {
  en: string; ru: string; starter: string; solution: string; lang: string;
  tests: { input: string; expectedOutput: string; isHidden: boolean }[];
  hints: { order: number; textEn: string; textRu: string }[];
}

async function upsertExercise(
  db: PrismaClient,
  chapterId: string,
  slug: string,
  titleEn: string,
  titleRu: string,
  order: number,
  xpReward: number,
  ex: ExerciseData
) {
  const lesson = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: { contentEn: ex.en, contentRu: ex.ru, titleEn, titleRu },
    create: {
      chapterId, slug, type: 'exercise', titleEn, titleRu,
      order, xpReward, estimatedMin: 15, isPublished: true,
      contentEn: ex.en, contentRu: ex.ru,
    },
  })

  await db.exercise.upsert({
    where: { lessonId: lesson.id },
    update: {
      instructionsEn: ex.en, instructionsRu: ex.ru,
      starterCode: ex.starter, solutionCode: ex.solution,
      hints: ex.hints,
    },
    create: {
      lessonId: lesson.id,
      instructionsEn: ex.en, instructionsRu: ex.ru,
      starterCode: ex.starter, solutionCode: ex.solution,
      language: ex.lang as any,
      timeoutMs: 5000, testCases: ex.tests, hints: ex.hints,
    },
  })

  return lesson
}
