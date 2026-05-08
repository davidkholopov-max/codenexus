import type { PrismaClient } from '@prisma/client'

export async function seedSQLCourse(db: PrismaClient) {
  const course = await db.course.upsert({
    where: { slug: 'sql-basics' },
    update: {},
    create: {
      slug: 'sql-basics',
      language: 'sql',
      titleEn: 'SQL & Databases',
      titleRu: 'SQL и базы данных',
      descriptionEn: 'Master SQL from scratch. SELECT, WHERE, JOIN, GROUP BY, and indexes.',
      descriptionRu: 'Освой SQL с нуля. SELECT, WHERE, JOIN, GROUP BY и индексы.',
      level: 1,
      order: 4,
      isPublished: true,
      totalXP: 500,
    },
  })

  // ─── Chapter 1: SELECT Basics ─────────────────────────────────────────────
  const ch1 = await upsert(db, course.id, 'select-basics', 'SELECT Basics', 'Основы SELECT', 1)

  await theory(db, ch1.id, 'what-is-sql', 'What is SQL?', 'Что такое SQL?', 1, 10, `
# What is SQL?

**SQL** (Structured Query Language) is the standard language for managing relational databases.

## Why learn SQL?
- Every app with persistent data uses a database
- Used in analytics, backend development, data science
- One of the most in-demand skills for developers

## Basic SELECT
\`\`\`sql
-- Get all columns from a table
SELECT * FROM users;

-- Get specific columns
SELECT name, email FROM users;

-- Add a condition
SELECT name, age FROM users WHERE age >= 18;
\`\`\`

## Sorting results
\`\`\`sql
SELECT name, age FROM users
ORDER BY age DESC;   -- DESC = largest first
\`\`\`

## Limiting results
\`\`\`sql
SELECT name FROM users
ORDER BY age DESC
LIMIT 5;   -- only 5 rows
\`\`\`
  `.trim(), `
# Что такое SQL?

SQL — это не совсем "язык программирования" в обычном смысле. В Python, Go, Java вы говорите компьютеру **как** делать что-то (шаг за шагом). В SQL вы говорите **что** вам нужно — и база данных сама решает как это получить.

Представьте базу данных как Excel с множеством листов. Каждый лист — это таблица. SQL — это способ спрашивать: "покажи мне строки из этого листа где значение в колонке больше 100".

## Таблица — основа всего

Данные в SQL хранятся в таблицах. Таблица — это как Excel-лист: колонки сверху, строки с данными.

Например, таблица \`users\`:
| id | name | age | city |
|----|------|-----|------|
| 1 | Дима | 25 | Москва |
| 2 | Аня | 30 | СПб |
| 3 | Петя | 17 | Казань |

## SELECT — "покажи мне"

\`SELECT\` выбирает данные из таблицы.

**Все колонки:**
\`\`\`sql
SELECT * FROM users;
\`\`\`
Читается: "покажи мне всё (\`*\`) из таблицы \`users\`". Звёздочка — это "все колонки".

**Конкретные колонки:**
\`\`\`sql
SELECT name, age FROM users;
\`\`\`
Читается: "покажи мне колонки \`name\` и \`age\` из таблицы \`users\`".

## WHERE — "но только если"

\`WHERE\` добавляет условие-фильтр.

\`\`\`sql
SELECT name, age FROM users WHERE age >= 18;
\`\`\`
Читается: "покажи имена и возраст из users, но только тех кому 18 или больше".

Из нашей таблицы выведется только Дима и Аня (Пете 17 — не подходит).

## ORDER BY — сортировка

\`\`\`sql
SELECT name, age FROM users
ORDER BY age DESC;
\`\`\`
\`DESC\` = по убыванию (от большего к меньшему). \`ASC\` = по возрастанию (по умолчанию).

Результат: сначала Аня (30), потом Дима (25), потом Петя (17).

## LIMIT — ограничение количества строк

\`\`\`sql
SELECT name FROM users
ORDER BY age DESC
LIMIT 2;
\`\`\`
Вернёт только первые 2 строки после сортировки — Аню и Диму.

## Важно: SQL не чувствителен к регистру ключевых слов

\`SELECT\` = \`select\` = \`Select\` — всё одинаково. Принято писать ключевые слова ЗАГЛАВНЫМИ для читаемости.

Названия таблиц и колонок — регистр важен: \`users\` ≠ \`Users\`.
  `.trim())

  await exercise(db, ch1.id, 'select-exercise', 'Your First Query', 'Первый запрос', 2, 20, {
    en: 'Given a "products" table with columns: id, name, price, category.\nWrite a query to select all products with price > 100, ordered by price descending.',
    ru: `Дана таблица "products" со столбцами: id, name, price, category.

Напиши запрос который выбирает все продукты с ценой больше 100, отсортированные по цене от дорогого к дешёвому.

По-человечески: "покажи все данные из products, только те где price > 100, и отсортируй по цене от большего к меньшему".`,
    starter: `-- Таблица products уже создана и заполнена
-- Напишите ваш SELECT запрос ниже:

SELECT `,
    solution: `SELECT * FROM products WHERE price > 100 ORDER BY price DESC;`,
    lang: 'sql',
    tests: [{
      input: `CREATE TABLE products(id INT, name TEXT, price REAL, category TEXT);
INSERT INTO products VALUES (1,'Laptop',999,'Electronics'),(2,'Phone',599,'Electronics'),(3,'Book',15,'Education'),(4,'Desk',249,'Furniture'),(5,'Coffee',8,'Food');
SELECT * FROM products WHERE price > 100 ORDER BY price DESC;`,
      expectedOutput: '1|Laptop|999.0|Electronics\n4|Desk|249.0|Furniture\n2|Phone|599.0|Electronics',
      isHidden: false,
    }],
    hints: [
      { order: 1, textEn: 'Use WHERE price > 100', textRu: 'После FROM products добавьте: WHERE price > 100' },
      { order: 2, textEn: 'Add ORDER BY price DESC at the end', textRu: 'В конце добавьте: ORDER BY price DESC — DESC значит от большего к меньшему' },
    ],
  })

  // ─── Chapter 2: Filtering & Aggregation ───────────────────────────────────
  const ch2 = await upsert(db, course.id, 'aggregation', 'Filtering & Aggregation', 'Фильтрация и агрегация', 2)

  await theory(db, ch2.id, 'where-and-agg', 'WHERE & Aggregate Functions', 'WHERE и агрегатные функции', 1, 10, `
# WHERE & Aggregate Functions

## WHERE with multiple conditions
\`\`\`sql
SELECT * FROM orders
WHERE status = 'shipped'
  AND total > 50;

SELECT * FROM users
WHERE country = 'US' OR country = 'CA';

SELECT * FROM products
WHERE category IN ('Electronics', 'Phones');
\`\`\`

## Aggregate functions
\`\`\`sql
SELECT COUNT(*)         FROM orders;            -- total rows
SELECT SUM(total)       FROM orders;            -- sum
SELECT AVG(total)       FROM orders;            -- average
SELECT MIN(price)       FROM products;          -- minimum
SELECT MAX(price)       FROM products;          -- maximum
\`\`\`

## GROUP BY
\`\`\`sql
SELECT category, COUNT(*), AVG(price)
FROM products
GROUP BY category;
\`\`\`

## HAVING (filter after GROUP BY)
\`\`\`sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING avg_price > 100;
\`\`\`
  `.trim(), `
# WHERE и агрегатные функции

## WHERE с несколькими условиями

Можно комбинировать условия через \`AND\` (и) и \`OR\` (или):

\`\`\`sql
-- Оба условия должны быть верны
SELECT * FROM orders
WHERE status = 'shipped' AND total > 50;

-- Хотя бы одно условие верно
SELECT * FROM users
WHERE city = 'Москва' OR city = 'СПб';
\`\`\`

**\`IN\`** — удобный способ написать "OR" для одного поля:
\`\`\`sql
-- Вместо: WHERE category = 'Электроника' OR category = 'Телефоны'
SELECT * FROM products
WHERE category IN ('Электроника', 'Телефоны');
\`\`\`

## NULL — "пусто" в таблице

NULL — это особое значение "ничего нет". Это не ноль, не пустая строка — именно отсутствие значения. Как пустая ячейка в Excel.

\`\`\`sql
-- Найти строки где email не заполнен
SELECT * FROM users WHERE email IS NULL;

-- Найти строки где email заполнен
SELECT * FROM users WHERE email IS NOT NULL;
\`\`\`

**Важно**: нельзя писать \`WHERE email = NULL\` — это не работает. Только \`IS NULL\` и \`IS NOT NULL\`.

## Агрегатные функции — итоговые расчёты

Это как "итоговая строка" в Excel. Считают что-то по всей колонке:

Возьмём таблицу \`orders\` (заказы): id, product, amount (сумма):
| id | product | amount |
|----|---------|--------|
| 1 | Ноутбук | 50000 |
| 2 | Телефон | 30000 |
| 3 | Книга | 500 |

\`\`\`sql
SELECT COUNT(*)     FROM orders;  -- 3 (сколько строк)
SELECT SUM(amount)  FROM orders;  -- 80500 (сумма всех)
SELECT AVG(amount)  FROM orders;  -- 26833.3 (среднее)
SELECT MIN(amount)  FROM orders;  -- 500 (минимум)
SELECT MAX(amount)  FROM orders;  -- 50000 (максимум)
\`\`\`

## GROUP BY — "сгруппировать и посчитать"

Хотим узнать сколько заказов и какая средняя сумма по каждой категории:

\`\`\`sql
SELECT category, COUNT(*) AS count, AVG(amount) AS avg_amount
FROM orders
GROUP BY category;
\`\`\`

Это как в Excel: сначала группируете строки по категории, потом считаете итог для каждой группы.

**\`AS\`** — даёт псевдоним (короткое имя) для колонки в результате. \`COUNT(*) AS count\` — колонка будет называться \`count\`.

## HAVING — фильтр после группировки

\`WHERE\` фильтрует строки **до** группировки. \`HAVING\` фильтрует **после**:

\`\`\`sql
SELECT category, AVG(amount) AS avg_amount
FROM orders
GROUP BY category
HAVING avg_amount > 10000;
-- Только категории где средний заказ > 10000
\`\`\`

Правило: **WHERE** для исходных строк → **GROUP BY** для группировки → **HAVING** для фильтра по группам.
  `.trim())

  await exercise(db, ch2.id, 'groupby-exercise', 'Sales Report', 'Отчёт о продажах', 2, 35, {
    en: 'Given "sales" table (id, product, amount, region). Write a query showing total sales per region, only regions with total > 1000, ordered by total descending.',
    ru: `Дана таблица "sales" (id, product, amount, region).

Напишите запрос: суммарные продажи по каждому региону, но только регионы где сумма больше 1000, отсортированные от большего к меньшему.

По-человечески: "сгруппируй по region, посчитай SUM(amount), покажи только группы где сумма > 1000, отсортируй по убыванию".`,
    starter: '-- Напишите ваш GROUP BY запрос:\nSELECT ',
    solution: 'SELECT region, SUM(amount) AS total FROM sales GROUP BY region HAVING total > 1000 ORDER BY total DESC;',
    lang: 'sql',
    tests: [{
      input: `CREATE TABLE sales(id INT,product TEXT,amount REAL,region TEXT);
INSERT INTO sales VALUES(1,'A',500,'North'),(2,'B',800,'South'),(3,'C',300,'North'),(4,'D',1200,'East'),(5,'E',400,'South'),(6,'F',900,'North');
SELECT region, SUM(amount) AS total FROM sales GROUP BY region HAVING total > 1000 ORDER BY total DESC;`,
      expectedOutput: 'North|1700.0\nEast|1200.0',
      isHidden: false,
    }],
    hints: [
      { order: 1, textEn: 'GROUP BY region, then SUM(amount)', textRu: 'SELECT region, SUM(amount) AS total FROM sales GROUP BY region' },
      { order: 2, textEn: 'Use HAVING SUM(amount) > 1000 — not WHERE', textRu: 'Добавьте HAVING total > 1000 — именно HAVING (не WHERE) для фильтра по результату агрегации' },
    ],
  })

  // ─── Chapter 3: JOINs ─────────────────────────────────────────────────────
  const ch3 = await upsert(db, course.id, 'joins', 'JOINs', 'JOIN-ы', 3)

  await theory(db, ch3.id, 'joins-theory', 'Joining Tables', 'Объединение таблиц', 1, 12, `
# JOINs in SQL

JOINs combine rows from multiple tables based on a related column.

## INNER JOIN — only matching rows
\`\`\`sql
SELECT users.name, orders.total
FROM orders
INNER JOIN users ON orders.user_id = users.id;
\`\`\`

## LEFT JOIN — all rows from left table
\`\`\`sql
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Users without orders appear with NULL for orders columns
\`\`\`

## Aliases make queries readable
\`\`\`sql
SELECT u.name, o.total, o.created_at
FROM users AS u
JOIN orders AS o ON u.id = o.user_id
WHERE o.total > 100
ORDER BY o.created_at DESC;
\`\`\`

## Multiple JOINs
\`\`\`sql
SELECT u.name, p.name AS product, oi.quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
\`\`\`
  `.trim(), `
# JOIN-ы — объединяем таблицы

## Зачем несколько таблиц?

В реальных базах данных данные разбиты по таблицам. Например:
- Таблица \`users\`: id, name, email
- Таблица \`orders\`: id, user_id, total

Данные о пользователе и его заказах хранятся отдельно, но связаны через \`user_id\`. JOIN "склеивает" их как объединение двух листов Excel по общей колонке.

## INNER JOIN — только совпадающие строки

Представьте: у вас есть два листа. \`users\` и \`orders\`. Хотим увидеть имена пользователей и суммы их заказов.

\`\`\`sql
SELECT users.name, orders.total
FROM orders
INNER JOIN users ON orders.user_id = users.id;
\`\`\`

Читается: "возьми \`orders\`, присоедини \`users\` там где \`orders.user_id\` совпадает с \`users.id\`".

**INNER JOIN** показывает только строки у которых есть совпадение в обеих таблицах. Пользователь без заказов — не попадёт. Заказ без пользователя — тоже не попадёт.

## LEFT JOIN — все строки из левой таблицы

\`\`\`sql
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
\`\`\`

**LEFT JOIN** берёт **все** строки из левой таблицы (\`users\`), даже если справа (\`orders\`) нет совпадения. У пользователя без заказов поле \`total\` будет \`NULL\`.

Разница INNER vs LEFT:
- **INNER JOIN** — только пары у которых есть совпадение
- **LEFT JOIN** — все из левой, совпавшие из правой (или NULL)

## Псевдонимы AS — сокращаем имена

Когда таблиц несколько, писать полные имена неудобно. \`AS\` даёт короткие псевдонимы:

\`\`\`sql
SELECT u.name, o.total
FROM users AS u
JOIN orders AS o ON u.id = o.user_id
WHERE o.total > 500
ORDER BY o.total DESC;
\`\`\`

\`users AS u\` — теперь можно писать \`u.name\` вместо \`users.name\`. Можно и без \`AS\`: \`FROM users u\`.

## Несколько JOIN подряд

Можно объединять сколько угодно таблиц:

\`\`\`sql
SELECT u.name, p.name AS product, oi.quantity
FROM users u
JOIN orders o     ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p   ON oi.product_id = p.id;
\`\`\`

Читается как цепочка: пользователи → их заказы → позиции в заказах → продукты в позициях.

## Примечание: SQLite (то что используется здесь)

Упражнения выполняются в SQLite. Отличия от MySQL/PostgreSQL:
- Нет \`FULL OUTER JOIN\` — используйте \`LEFT JOIN UNION\`
- Склеивание строк: \`||\ вместо \`CONCAT()\`: \`'Привет ' || name\`
- В остальном синтаксис одинаковый
  `.trim())

  await exercise(db, ch3.id, 'join-exercise', 'Customer Orders', 'Заказы клиентов', 2, 45, {
    en: 'Join customers and orders tables. Show: customer name and their order total. Only orders over 200. Sort by total descending.',
    ru: `Объедините таблицы customers и orders.

Покажите: имя клиента и сумму заказа. Только заказы больше 200. Сортировка по сумме от большего к меньшему.

По-человечески: "возьми customers, присоедини orders по customer_id, покажи name и total, только где total > 200, отсортируй по убыванию".`,
    starter: '-- Напишите ваш JOIN запрос:\nSELECT ',
    solution: 'SELECT c.name, o.total FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.total > 200 ORDER BY o.total DESC;',
    lang: 'sql',
    tests: [{
      input: `CREATE TABLE customers(id INT,name TEXT);CREATE TABLE orders(id INT,customer_id INT,total REAL);INSERT INTO customers VALUES(1,'Alice'),(2,'Bob'),(3,'Carol');INSERT INTO orders VALUES(1,1,350),(2,1,150),(3,2,480),(4,3,220),(5,2,90);SELECT c.name, o.total FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.total > 200 ORDER BY o.total DESC;`,
      expectedOutput: 'Bob|480.0\nAlice|350.0\nCarol|220.0',
      isHidden: false,
    }],
    hints: [
      { order: 1, textEn: 'JOIN customers c ON c.id = o.customer_id', textRu: 'FROM customers c JOIN orders o ON c.id = o.customer_id — связываем по customer_id' },
      { order: 2, textEn: 'WHERE o.total > 200 filters before ORDER BY', textRu: 'Добавьте WHERE o.total > 200 и в конце ORDER BY o.total DESC' },
    ],
  })

  console.log('  ✓ Seeded SQL & Databases course')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsert(db: PrismaClient, courseId: string, slug: string, titleEn: string, titleRu: string, order: number) {
  return db.chapter.upsert({
    where: { courseId_slug: { courseId, slug } },
    update: {},
    create: { courseId, slug, titleEn, titleRu, order },
  })
}

async function theory(db: PrismaClient, chapterId: string, slug: string, titleEn: string, titleRu: string, order: number, xp: number, contentEn: string, contentRu: string) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: { contentEn, contentRu, titleEn, titleRu },
    create: { chapterId, slug, type: 'theory', titleEn, titleRu, order, xpReward: xp, estimatedMin: 8, isPublished: true, contentEn, contentRu },
  })
}

interface Ex {
  en: string; ru: string; starter: string; solution: string; lang: string;
  tests: { input: string; expectedOutput: string; isHidden: boolean }[];
  hints: { order: number; textEn: string; textRu: string }[];
}

async function exercise(db: PrismaClient, chapterId: string, slug: string, titleEn: string, titleRu: string, order: number, xp: number, ex: Ex) {
  const lesson = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: { contentEn: ex.en, contentRu: ex.ru, titleEn, titleRu },
    create: { chapterId, slug, type: 'exercise', titleEn, titleRu, order, xpReward: xp, estimatedMin: 15, isPublished: true, contentEn: ex.en, contentRu: ex.ru },
  })
  await db.exercise.upsert({
    where: { lessonId: lesson.id },
    update: { instructionsEn: ex.en, instructionsRu: ex.ru, starterCode: ex.starter, solutionCode: ex.solution, hints: ex.hints },
    create: { lessonId: lesson.id, instructionsEn: ex.en, instructionsRu: ex.ru, starterCode: ex.starter, solutionCode: ex.solution, language: ex.lang as any, timeoutMs: 5000, testCases: ex.tests, hints: ex.hints },
  })
  return lesson
}
