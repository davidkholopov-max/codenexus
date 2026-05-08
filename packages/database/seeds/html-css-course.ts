import type { PrismaClient } from '@prisma/client'

export async function seedHTMLCSSCourse(db: PrismaClient) {
  const course = await db.course.upsert({
    where: { slug: 'html-css' },
    update: {},
    create: {
      slug: 'html-css',
      language: 'html',
      titleEn: 'HTML & CSS Essentials',
      titleRu: 'HTML и CSS: основы',
      descriptionEn: 'Build real web pages from scratch. Semantic HTML, Flexbox, Grid, animations.',
      descriptionRu: 'Создавай настоящие веб-страницы с нуля. Семантический HTML, Flexbox, Grid, анимации.',
      level: 1,
      order: 3,
      isPublished: true,
      totalXP: 450,
    },
  })

  // ─── Chapter 1: HTML Structure ────────────────────────────────────────────
  const ch1 = await upsert(db, course.id, 'html-structure', 'HTML Structure', 'Структура HTML', 1)

  await theory(db, ch1.id, 'what-is-html', 'What is HTML?', 'Что такое HTML?', 1, 10, `
# What is HTML?

**HTML** (HyperText Markup Language) is the skeleton of every web page. It defines the structure and content.

## Basic page structure
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Common tags
\`\`\`html
<h1> to <h6>   Headings (h1 = largest)
<p>             Paragraph
<a href="...">  Link
<img src="..."> Image
<ul> <ol> <li>  Lists
<div>           Generic container
<span>          Inline container
<strong>        Bold text
<em>            Italic text
\`\`\`

## Semantic HTML5 elements
\`\`\`html
<header>    Site header
<nav>       Navigation
<main>      Main content
<section>   A section
<article>   Self-contained content
<aside>     Sidebar
<footer>    Site footer
\`\`\`
  `.trim(), `
# Что такое HTML?

**HTML** (HyperText Markup Language) — это скелет каждой веб-страницы. Он определяет структуру и содержимое.

## Базовая структура страницы
\`\`\`html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Моя страница</title>
</head>
<body>
  <h1>Привет, мир!</h1>
  <p>Это моя первая веб-страница.</p>
</body>
</html>
\`\`\`

## Распространённые теги
\`\`\`html
<h1> до <h6>   Заголовки (h1 = самый большой)
<p>             Абзац
<a href="...">  Ссылка
<img src="..."> Изображение
<ul> <ol> <li>  Списки
<div>           Универсальный контейнер
<span>          Строчный контейнер
<strong>        Жирный текст
<em>            Курсив
\`\`\`

## Семантические элементы HTML5
\`\`\`html
<header>    Шапка сайта
<nav>       Навигация
<main>      Основной контент
<section>   Раздел
<article>   Самостоятельный контент
<aside>     Боковая панель
<footer>    Подвал сайта
\`\`\`
  `.trim())

  await quiz(db, ch1.id, 'html-basics-quiz', 'HTML Basics Quiz', 'Квиз: основы HTML', 2, 15, [
    {
      questionEn: 'Which tag is used for the largest heading?',
      questionRu: 'Какой тег используется для самого большого заголовка?',
      options: [
        { textEn: '<h6>', textRu: '<h6>', isCorrect: false },
        { textEn: '<h1>', textRu: '<h1>', isCorrect: true },
        { textEn: '<heading>', textRu: '<heading>', isCorrect: false },
        { textEn: '<title>', textRu: '<title>', isCorrect: false },
      ],
    },
    {
      questionEn: 'What does the <!DOCTYPE html> declaration do?',
      questionRu: 'Что делает объявление <!DOCTYPE html>?',
      options: [
        { textEn: 'Defines the page title', textRu: 'Задаёт заголовок страницы', isCorrect: false },
        { textEn: 'Creates a comment', textRu: 'Создаёт комментарий', isCorrect: false },
        { textEn: 'Tells the browser to use HTML5', textRu: 'Указывает браузеру использовать HTML5', isCorrect: true },
        { textEn: 'Links a CSS file', textRu: 'Подключает файл CSS', isCorrect: false },
      ],
    },
    {
      questionEn: 'Which HTML element represents the main navigation links?',
      questionRu: 'Какой HTML-элемент представляет основные навигационные ссылки?',
      options: [
        { textEn: '<menu>', textRu: '<menu>', isCorrect: false },
        { textEn: '<navigation>', textRu: '<navigation>', isCorrect: false },
        { textEn: '<nav>', textRu: '<nav>', isCorrect: true },
        { textEn: '<links>', textRu: '<links>', isCorrect: false },
      ],
    },
    {
      questionEn: 'Which tag creates an unordered (bulleted) list?',
      questionRu: 'Какой тег создаёт маркированный список?',
      options: [
        { textEn: '<ol>', textRu: '<ol>', isCorrect: false },
        { textEn: '<li>', textRu: '<li>', isCorrect: false },
        { textEn: '<list>', textRu: '<list>', isCorrect: false },
        { textEn: '<ul>', textRu: '<ul>', isCorrect: true },
      ],
    },
  ])

  await theory(db, ch1.id, 'css-intro', 'Introduction to CSS', 'Введение в CSS', 3, 10, `
# Introduction to CSS

**CSS** (Cascading Style Sheets) styles your HTML — colors, fonts, layout, animations.

## Adding CSS
\`\`\`html
<!-- In <head> tag -->
<style>
  h1 { color: blue; }
</style>

<!-- Or link an external file -->
<link rel="stylesheet" href="styles.css">
\`\`\`

## CSS syntax
\`\`\`css
selector {
  property: value;
}

/* Examples */
h1 {
  color: #1a1a2e;
  font-size: 2rem;
  font-weight: bold;
}

p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}
\`\`\`

## Selectors
\`\`\`css
h1          { }  /* element */
.card       { }  /* class */
#header     { }  /* id */
.card p     { }  /* descendant */
button:hover{ }  /* pseudo-class */
\`\`\`

## Box model
Every element is a box: content → padding → border → margin
\`\`\`css
.box {
  width: 200px;
  padding: 16px;
  border: 2px solid #ccc;
  margin: 8px;
  border-radius: 8px;
}
\`\`\`
  `.trim(), `
# Введение в CSS

**CSS** (Cascading Style Sheets) стилизует HTML — цвета, шрифты, разметку, анимации.

## Добавление CSS
\`\`\`html
<!-- В теге <head> -->
<style>
  h1 { color: blue; }
</style>

<!-- Или подключить внешний файл -->
<link rel="stylesheet" href="styles.css">
\`\`\`

## Синтаксис CSS
\`\`\`css
селектор {
  свойство: значение;
}
\`\`\`

## Селекторы
\`\`\`css
h1          { }  /* элемент */
.card       { }  /* класс */
#header     { }  /* id */
.card p     { }  /* потомок */
button:hover{ }  /* псевдокласс */
\`\`\`

## Блочная модель
Каждый элемент — прямоугольник: содержимое → padding → border → margin
\`\`\`css
.box {
  width: 200px;
  padding: 16px;
  border: 2px solid #ccc;
  margin: 8px;
  border-radius: 8px;
}
\`\`\`
  `.trim())

  await quiz(db, ch1.id, 'css-basics-quiz', 'CSS Basics Quiz', 'Квиз: основы CSS', 4, 15, [
    {
      questionEn: 'How do you select an element with class "card" in CSS?',
      questionRu: 'Как выбрать элемент с классом "card" в CSS?',
      options: [
        { textEn: '#card', textRu: '#card', isCorrect: false },
        { textEn: '.card', textRu: '.card', isCorrect: true },
        { textEn: 'card', textRu: 'card', isCorrect: false },
        { textEn: '*card', textRu: '*card', isCorrect: false },
      ],
    },
    {
      questionEn: 'Which CSS property changes text color?',
      questionRu: 'Какое свойство CSS изменяет цвет текста?',
      options: [
        { textEn: 'font-color', textRu: 'font-color', isCorrect: false },
        { textEn: 'text-color', textRu: 'text-color', isCorrect: false },
        { textEn: 'color', textRu: 'color', isCorrect: true },
        { textEn: 'foreground', textRu: 'foreground', isCorrect: false },
      ],
    },
    {
      questionEn: 'In the CSS box model, which area is closest to the content?',
      questionRu: 'В блочной модели CSS какая область ближайшая к содержимому?',
      options: [
        { textEn: 'margin', textRu: 'margin', isCorrect: false },
        { textEn: 'border', textRu: 'border', isCorrect: false },
        { textEn: 'outline', textRu: 'outline', isCorrect: false },
        { textEn: 'padding', textRu: 'padding', isCorrect: true },
      ],
    },
  ])

  // ─── Chapter 2: Flexbox Layout ────────────────────────────────────────────
  const ch2 = await upsert(db, course.id, 'flexbox', 'Flexbox Layout', 'Разметка Flexbox', 2)

  await theory(db, ch2.id, 'flexbox-theory', 'Flexbox', 'Flexbox', 1, 12, `
# Flexbox

Flexbox makes it easy to arrange elements in a row or column.

## Container properties
\`\`\`css
.container {
  display: flex;
  flex-direction: row;       /* row | column */
  justify-content: center;   /* main axis: start|center|end|space-between|space-around */
  align-items: center;       /* cross axis: start|center|end|stretch */
  gap: 16px;                 /* space between items */
  flex-wrap: wrap;           /* allow wrapping */
}
\`\`\`

## Item properties
\`\`\`css
.item {
  flex: 1;          /* grow to fill available space */
  flex-shrink: 0;   /* don't shrink */
  align-self: flex-end; /* override align-items for this item */
}
\`\`\`

## Common patterns
\`\`\`css
/* Center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Card grid */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card { flex: 1 1 280px; } /* min 280px, then grow */
\`\`\`
  `.trim(), `
# Flexbox

Flexbox позволяет легко располагать элементы в строку или столбец.

## Свойства контейнера
\`\`\`css
.container {
  display: flex;
  flex-direction: row;       /* row | column */
  justify-content: center;   /* главная ось */
  align-items: center;       /* поперечная ось */
  gap: 16px;
  flex-wrap: wrap;
}
\`\`\`

## Свойства элементов
\`\`\`css
.item {
  flex: 1;              /* растянуться */
  flex-shrink: 0;       /* не сжиматься */
  align-self: flex-end; /* своё выравнивание */
}
\`\`\`

## Паттерн: центрирование
\`\`\`css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`
  `.trim())

  await quiz(db, ch2.id, 'flexbox-quiz', 'Flexbox Quiz', 'Квиз: Flexbox', 2, 20, [
    {
      questionEn: 'Which CSS property enables Flexbox on a container?',
      questionRu: 'Какое свойство CSS включает Flexbox для контейнера?',
      options: [
        { textEn: 'display: block', textRu: 'display: block', isCorrect: false },
        { textEn: 'display: flex', textRu: 'display: flex', isCorrect: true },
        { textEn: 'position: flex', textRu: 'position: flex', isCorrect: false },
        { textEn: 'layout: flex', textRu: 'layout: flex', isCorrect: false },
      ],
    },
    {
      questionEn: 'Which property aligns items along the main axis (horizontal by default)?',
      questionRu: 'Какое свойство выравнивает элементы по главной оси (горизонтальной по умолчанию)?',
      options: [
        { textEn: 'align-items', textRu: 'align-items', isCorrect: false },
        { textEn: 'align-content', textRu: 'align-content', isCorrect: false },
        { textEn: 'justify-content', textRu: 'justify-content', isCorrect: true },
        { textEn: 'flex-align', textRu: 'flex-align', isCorrect: false },
      ],
    },
    {
      questionEn: 'What value of justify-content puts equal space BETWEEN items (no space at edges)?',
      questionRu: 'Какое значение justify-content помещает равные промежутки МЕЖДУ элементами (без промежутков по краям)?',
      options: [
        { textEn: 'space-around', textRu: 'space-around', isCorrect: false },
        { textEn: 'space-evenly', textRu: 'space-evenly', isCorrect: false },
        { textEn: 'space-between', textRu: 'space-between', isCorrect: true },
        { textEn: 'distribute', textRu: 'distribute', isCorrect: false },
      ],
    },
    {
      questionEn: 'What does flex: 1 do on a flex item?',
      questionRu: 'Что делает flex: 1 у flex-элемента?',
      options: [
        { textEn: 'Sets font-size to 1rem', textRu: 'Устанавливает font-size в 1rem', isCorrect: false },
        { textEn: 'Makes the item 1px wide', textRu: 'Делает элемент шириной 1px', isCorrect: false },
        { textEn: 'Allows the item to grow and fill available space', textRu: 'Позволяет элементу расти и заполнять доступное пространство', isCorrect: true },
        { textEn: 'Sets order: 1', textRu: 'Устанавливает order: 1', isCorrect: false },
      ],
    },
  ])

  // ─── Chapter 3: CSS Grid ──────────────────────────────────────────────────
  const ch3 = await upsert(db, course.id, 'css-grid', 'CSS Grid', 'CSS Grid', 3)

  await theory(db, ch3.id, 'grid-theory', 'CSS Grid', 'CSS Grid', 1, 12, `
# CSS Grid

Grid is the most powerful layout system for 2D layouts (rows AND columns).

## Basic grid
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-template-rows: auto;
  gap: 24px;
}
\`\`\`

## repeat() and fr unit
\`\`\`css
.grid {
  grid-template-columns: repeat(3, 1fr);  /* same as above */
  grid-template-columns: 250px 1fr;       /* sidebar + content */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* responsive! */
}
\`\`\`

## Placing items
\`\`\`css
.hero {
  grid-column: 1 / -1;  /* span full width */
  grid-row: 1 / 3;      /* span 2 rows */
}
\`\`\`

## Named areas
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`
  `.trim(), `
# CSS Grid

Grid — самая мощная система разметки для двухмерных макетов.

## Базовая сетка
\`\`\`css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}
\`\`\`

## repeat() и единица fr
\`\`\`css
.grid {
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* адаптивно! */
}
\`\`\`

## Именованные области
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
\`\`\`
  `.trim())

  await quiz(db, ch3.id, 'grid-quiz', 'CSS Grid Quiz', 'Квиз: CSS Grid', 2, 20, [
    {
      questionEn: 'What does the "fr" unit represent in CSS Grid?',
      questionRu: 'Что означает единица "fr" в CSS Grid?',
      options: [
        { textEn: 'Font ratio', textRu: 'Соотношение шрифта', isCorrect: false },
        { textEn: 'Fixed row', textRu: 'Фиксированная строка', isCorrect: false },
        { textEn: 'A fraction of the available space', textRu: 'Доля доступного пространства', isCorrect: true },
        { textEn: 'Frame rate', textRu: 'Частота кадров', isCorrect: false },
      ],
    },
    {
      questionEn: 'How do you make a grid item span all columns?',
      questionRu: 'Как растянуть grid-элемент на все столбцы?',
      options: [
        { textEn: 'width: 100%', textRu: 'width: 100%', isCorrect: false },
        { textEn: 'grid-column: 1 / -1', textRu: 'grid-column: 1 / -1', isCorrect: true },
        { textEn: 'flex: full', textRu: 'flex: full', isCorrect: false },
        { textEn: 'span: all', textRu: 'span: all', isCorrect: false },
      ],
    },
    {
      questionEn: 'Which shorthand creates 3 equal columns with a 16px gap?',
      questionRu: 'Какая запись создаёт 3 равных столбца с отступом 16px?',
      options: [
        { textEn: 'columns: 3; spacing: 16px', textRu: 'columns: 3; spacing: 16px', isCorrect: false },
        { textEn: 'grid-template-columns: repeat(3, 1fr); gap: 16px', textRu: 'grid-template-columns: repeat(3, 1fr); gap: 16px', isCorrect: true },
        { textEn: 'display: grid(3, 16px)', textRu: 'display: grid(3, 16px)', isCorrect: false },
        { textEn: 'flex: 3 columns 16px', textRu: 'flex: 3 columns 16px', isCorrect: false },
      ],
    },
    {
      questionEn: 'What is the difference between Flexbox and Grid?',
      questionRu: 'В чём разница между Flexbox и Grid?',
      options: [
        { textEn: 'Flexbox is for 2D layouts, Grid is for 1D', textRu: 'Flexbox для 2D-разметки, Grid для 1D', isCorrect: false },
        { textEn: 'Grid only works in Chrome', textRu: 'Grid работает только в Chrome', isCorrect: false },
        { textEn: 'Flexbox is 1D (row or column), Grid is 2D (rows AND columns)', textRu: 'Flexbox одномерный (строка или столбец), Grid двумерный (строки И столбцы)', isCorrect: true },
        { textEn: 'They are identical', textRu: 'Они идентичны', isCorrect: false },
      ],
    },
  ])

  console.log('  ✓ Seeded HTML & CSS course')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsert(db: PrismaClient, courseId: string, slug: string, titleEn: string, titleRu: string, order: number) {
  return db.chapter.upsert({
    where: { courseId_slug: { courseId, slug } },
    update: {},
    create: { courseId, slug, titleEn, titleRu, order },
  })
}

async function theory(
  db: PrismaClient,
  chapterId: string,
  slug: string,
  titleEn: string,
  titleRu: string,
  order: number,
  xp: number,
  contentEn: string,
  contentRu: string,
) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: {},
    create: { chapterId, slug, type: 'theory', titleEn, titleRu, order, xpReward: xp, estimatedMin: 8, isPublished: true, contentEn, contentRu },
  })
}

interface QuizOption {
  textEn: string
  textRu: string
  isCorrect: boolean
}

interface QuizQuestion {
  questionEn: string
  questionRu: string
  options: QuizOption[]
}

async function quiz(
  db: PrismaClient,
  chapterId: string,
  slug: string,
  titleEn: string,
  titleRu: string,
  order: number,
  xp: number,
  questions: QuizQuestion[],
) {
  const lesson = await db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: {},
    create: {
      chapterId,
      slug,
      type: 'quiz',
      titleEn,
      titleRu,
      order,
      xpReward: xp,
      estimatedMin: 5,
      isPublished: true,
      contentEn: `Test your knowledge of ${titleEn}.`,
      contentRu: `Проверьте свои знания по теме: ${titleRu}.`,
    },
  })

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const existing = await db.quizItem.findFirst({ where: { lessonId: lesson.id, order: i + 1 } })
    if (!existing) {
      await db.quizItem.create({
        data: {
          lessonId: lesson.id,
          order: i + 1,
          questionEn: q.questionEn,
          questionRu: q.questionRu,
          options: q.options,
        },
      })
    }
  }

  return lesson
}
