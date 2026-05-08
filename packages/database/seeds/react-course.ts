import { PrismaClient } from '@prisma/client'

export async function seedReactCourse(db: PrismaClient) {
  console.log('  Seeding React specialization...')

  const existing = await db.course.findUnique({ where: { slug: 'react-fundamentals' } })
  if (existing) { console.log('  React course already exists, skipping.'); return }

  const parent = await db.course.findUnique({ where: { slug: 'javascript-basics' } })
  if (!parent) {
    console.log('  JavaScript course not found — seed JavaScript first!')
    return
  }

  const course = await db.course.create({
    data: {
      slug: 'react-fundamentals',
      language: 'javascript',
      titleEn: 'React: Modern Frontend',
      titleRu: 'React: современный фронтенд',
      descriptionEn: 'Build interactive UIs with React — components, hooks, state management, and real-world patterns used at Meta, Airbnb, and Netflix.',
      descriptionRu: 'Создавайте интерактивные интерфейсы с React — компоненты, хуки, управление состоянием и паттерны из практики Meta, Airbnb и Netflix.',
      level: 3,
      totalXP: 520,
      isPublished: true,
      parentCourseId: parent.id,
    },
  })

  // ─── Chapter 1: React Basics ──────────────────────────────────────────────
  const ch1 = await db.chapter.create({
    data: { courseId: course.id, slug: 'react-fundamentals', order: 1, titleEn: 'React Fundamentals', titleRu: 'Основы React' },
  })

  await theory(db, ch1.id, 'what-is-react', 'What is React?', 'Что такое React?', 1, 10, `
# What is React?

React is a **JavaScript library for building user interfaces**, created by Facebook in 2013. It's the most popular frontend library in the world.

## Core Ideas

### 1. Component-based
Everything is a component — a reusable, self-contained piece of UI.

\`\`\`jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

function App() {
  return (
    <div>
      <Button label="Click me" onClick={() => alert("Hello!")} />
      <Button label="Cancel" onClick={() => console.log("cancelled")} />
    </div>
  )
}
\`\`\`

### 2. Declarative
You describe **what** the UI should look like, not **how** to update it.

\`\`\`jsx
// React handles DOM updates automatically
function Counter({ count }) {
  return <h1>Count: {count}</h1>
}
\`\`\`

### 3. Virtual DOM
React maintains a virtual DOM and calculates the minimal changes needed to update the real DOM — fast!

## JSX

JSX is HTML-like syntax in JavaScript:

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello, React!</h1>

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello, React!')
\`\`\`

Rules:
- Use \`className\` instead of \`class\`
- Self-close empty tags: \`<img />\`, \`<br />\`
- One root element (or use Fragments: \`<></>\`)
- JavaScript expressions go in \`{ }\`

## React vs Vanilla JS

| Task | Vanilla JS | React |
|------|-----------|-------|
| Update text | \`el.textContent = ...\` | Re-render component |
| Add item to list | Manual DOM manipulation | Update state → auto re-render |
| Handle events | \`addEventListener\` | \`onClick={handler}\` |
| Reuse UI | Copy/paste HTML | Component |
  `.trim(), `
# Что такое React?

React — **JavaScript-библиотека для создания пользовательских интерфейсов**, созданная Facebook в 2013 году. Самая популярная frontend-библиотека в мире.

## Ключевые идеи

### 1. Компонентная архитектура
Всё — компонент: переиспользуемая, самодостаточная часть интерфейса.

\`\`\`jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
\`\`\`

### 2. Декларативность
Вы описываете **что** должен показывать интерфейс, а не **как** его обновлять.

### 3. Virtual DOM
React поддерживает виртуальный DOM и вычисляет минимальные изменения для обновления реального DOM.

## JSX

JSX — HTML-подобный синтаксис в JavaScript:

\`\`\`jsx
const element = <h1 className="title">Привет, React!</h1>
\`\`\`

Правила:
- Используйте \`className\` вместо \`class\`
- Самозакрывающиеся теги: \`<img />\`, \`<br />\`
- Один корневой элемент (или Fragment: \`<></>\`)
- JavaScript-выражения в \`{ }\`
  `.trim())

  await theory(db, ch1.id, 'react-state-props', 'State and Props', 'State и Props', 2, 12, `
# State and Props

## Props — Passing Data Down

Props (properties) pass data from parent to child components.

\`\`\`jsx
// Child component
function UserCard({ name, age, role = "User" }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <span className="badge">{role}</span>
    </div>
  )
}

// Parent
function App() {
  return (
    <>
      <UserCard name="Alice" age={28} role="Admin" />
      <UserCard name="Bob" age={24} />
    </>
  )
}
\`\`\`

Props are **read-only** — never modify them inside the component.

## useState — Local State

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // [value, setter]

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>−</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}
\`\`\`

## useState with Objects

\`\`\`jsx
function ProfileForm() {
  const [form, setForm] = useState({ name: '', email: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <p>Hello, {form.name}!</p>
    </form>
  )
}
\`\`\`

## Lifting State Up

When two siblings need the same data, lift state to their common parent:

\`\`\`jsx
function App() {
  const [query, setQuery] = useState('')

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultsList query={query} />
    </>
  )
}
\`\`\`
  `.trim(), `
# State и Props

## Props — передача данных вниз

Props передают данные от родительского компонента к дочернему.

\`\`\`jsx
function UserCard({ name, age, role = "User" }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Возраст: {age}</p>
      <span>{role}</span>
    </div>
  )
}
\`\`\`

Props **только для чтения** — никогда не изменяйте их внутри компонента.

## useState — локальное состояние

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>−</button>
      <button onClick={() => setCount(0)}>Сброс</button>
    </div>
  )
}
\`\`\`

## useState с объектами

\`\`\`jsx
const [form, setForm] = useState({ name: '', email: '' })

const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
}
\`\`\`
  `.trim())

  // ─── Chapter 2: Hooks ─────────────────────────────────────────────────────
  const ch2 = await db.chapter.create({
    data: { courseId: course.id, slug: 'react-hooks', order: 2, titleEn: 'React Hooks', titleRu: 'Хуки React' },
  })

  await theory(db, ch2.id, 'useeffect', 'useEffect and Side Effects', 'useEffect и побочные эффекты', 1, 12, `
# useEffect

\`useEffect\` handles **side effects**: data fetching, subscriptions, DOM manipulation.

\`\`\`jsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])  // dependency array: re-run when userId changes

  if (loading) return <p>Loading...</p>
  return <h1>{user.name}</h1>
}
\`\`\`

## Dependency Array

\`\`\`jsx
useEffect(() => { /* runs on every render */ })
useEffect(() => { /* runs only on mount */ }, [])
useEffect(() => { /* runs when id changes */ }, [id])
\`\`\`

## Cleanup

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(timer)  // cleanup on unmount
}, [])
\`\`\`

## useMemo and useCallback

\`\`\`jsx
import { useMemo, useCallback } from 'react'

// Expensive calculation — only recalculates when deps change
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
)

// Stable function reference — prevents child re-renders
const handleClick = useCallback(
  () => onSelect(item.id),
  [item.id, onSelect]
)
\`\`\`

## useRef

\`\`\`jsx
import { useRef, useEffect } from 'react'

function FocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()  // focus on mount
  }, [])

  return <input ref={inputRef} placeholder="I'm focused!" />
}
\`\`\`
  `.trim(), `
# useEffect

\`useEffect\` обрабатывает **побочные эффекты**: загрузку данных, подписки, работу с DOM.

\`\`\`jsx
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false) })
  }, [userId])  // перезапускать при изменении userId

  if (loading) return <p>Загрузка...</p>
  return <h1>{user.name}</h1>
}
\`\`\`

## Массив зависимостей

\`\`\`jsx
useEffect(() => { /* при каждом рендере */ })
useEffect(() => { /* только при монтировании */ }, [])
useEffect(() => { /* при изменении id */ }, [id])
\`\`\`

## Очистка

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => setTime(new Date()), 1000)
  return () => clearInterval(timer)  // при размонтировании
}, [])
\`\`\`
  `.trim())

  await theory(db, ch2.id, 'custom-hooks', 'Custom Hooks', 'Пользовательские хуки', 2, 12, `
# Custom Hooks

Custom hooks let you extract and reuse stateful logic.

## useFetch — Reusable Data Fetching

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()  // cancel on unmount/re-fetch
  }, [url])

  return { data, loading, error }
}

// Usage — clean and simple
function PostList() {
  const { data, loading, error } = useFetch('/api/posts')

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  return data.map(post => <PostCard key={post.id} post={post} />)
}
\`\`\`

## useLocalStorage

\`\`\`jsx
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = (newValue) => {
    setValue(newValue)
    window.localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue]
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark')
\`\`\`

## useDebounce — Throttle Input

\`\`\`jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// Usage: only search after 300ms of idle typing
function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data } = useFetch(\`/api/search?q=\${debouncedQuery}\`)
  ...
}
\`\`\`
  `.trim(), `
# Пользовательские хуки

Позволяют извлекать и переиспользовать логику с состоянием.

## useFetch — переиспользуемая загрузка данных

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

// Использование
function PostList() {
  const { data, loading, error } = useFetch('/api/posts')
  if (loading) return <Spinner />
  if (error) return <p>Ошибка: {error}</p>
  return data.map(post => <PostCard key={post.id} post={post} />)
}
\`\`\`

## useLocalStorage

\`\`\`jsx
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  })

  const setStoredValue = (newValue) => {
    setValue(newValue)
    window.localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue]
}

const [theme, setTheme] = useLocalStorage('theme', 'dark')
\`\`\`
  `.trim())

  // ─── Chapter 3: State Management ─────────────────────────────────────────
  const ch3 = await db.chapter.create({
    data: { courseId: course.id, slug: 'react-state-management', order: 3, titleEn: 'State Management', titleRu: 'Управление состоянием' },
  })

  await theory(db, ch3.id, 'context-api', 'Context API and useReducer', 'Context API и useReducer', 1, 15, `
# Context API and useReducer

## Context API — Global State Without Props Drilling

\`\`\`jsx
import { createContext, useContext, useState } from 'react'

// 1. Create context
const ThemeContext = createContext('light')

// 2. Provider wraps the app
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 3. Consume anywhere in the tree
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  )
}
\`\`\`

## useReducer — Complex State Logic

\`\`\`jsx
const initialState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + state.step }
    case 'DECREMENT': return { ...state, count: state.count - state.step }
    case 'SET_STEP':  return { ...state, step: action.payload }
    case 'RESET':     return initialState
    default:          return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <p>Count: {state.count}</p>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+{state.step}</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>−{state.step}</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  )
}
\`\`\`

## Zustand — Lightweight State Management

For larger apps, Zustand is simpler than Redux:

\`\`\`bash
npm install zustand
\`\`\`

\`\`\`jsx
import { create } from 'zustand'

const useStore = create((set) => ({
  cart: [],
  addItem: (item) => set(state => ({ cart: [...state.cart, item] })),
  removeItem: (id) => set(state => ({ cart: state.cart.filter(i => i.id !== id) })),
  clearCart: () => set({ cart: [] }),
  total: (state) => state.cart.reduce((sum, item) => sum + item.price, 0),
}))

// In any component
function CartIcon() {
  const count = useStore(state => state.cart.length)
  return <span>🛒 {count}</span>
}

function CartTotal() {
  const total = useStore(state => state.total(state))
  return <p>Total: \${total.toFixed(2)}</p>
}
\`\`\`
  `.trim(), `
# Context API и useReducer

## Context API — глобальное состояние без props drilling

\`\`\`jsx
import { createContext, useContext, useState } from 'react'

// 1. Создаём контекст
const ThemeContext = createContext('light')

// 2. Provider оборачивает приложение
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 3. Потребляем в любом месте дерева
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext)
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
    Тема: {theme}
  </button>
}
\`\`\`

## useReducer — сложная логика состояния

\`\`\`jsx
const initialState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + state.step }
    case 'DECREMENT': return { ...state, count: state.count - state.step }
    case 'RESET':     return initialState
    default:          return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <p>Счётчик: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Сброс</button>
    </div>
  )
}
\`\`\`
  `.trim())

  // ─── Chapter 4: Patterns and Best Practices ───────────────────────────────
  const ch4 = await db.chapter.create({
    data: { courseId: course.id, slug: 'react-patterns', order: 4, titleEn: 'Patterns & Best Practices', titleRu: 'Паттерны и лучшие практики' },
  })

  await theory(db, ch4.id, 'react-patterns', 'React Patterns', 'Паттерны React', 1, 15, `
# React Patterns and Best Practices

## 1. Compound Components

\`\`\`jsx
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = function TabList({ children }) {
  return <div role="tablist">{children}</div>
}

Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}

Tabs.Panel = function Panel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <div role="tabpanel">{children}</div> : null
}

// Usage
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="details">Details</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview"><Overview /></Tabs.Panel>
  <Tabs.Panel id="details"><Details /></Tabs.Panel>
</Tabs>
\`\`\`

## 2. Error Boundaries

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

// Wrap risky components
<ErrorBoundary>
  <UserDashboard />
</ErrorBoundary>
\`\`\`

## 3. Performance Optimizations

\`\`\`jsx
// React.memo — skip re-render if props unchanged
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return items.map(item => <Item key={item.id} item={item} />)
})

// Lazy loading — code splitting
const HeavyChart = React.lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
\`\`\`

## 4. Folder Structure

\`\`\`
src/
├── components/          # reusable UI
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── features/            # feature modules
│   ├── auth/
│   └── dashboard/
├── hooks/               # custom hooks
├── lib/                 # utilities, API clients
├── pages/               # route-level components
└── store/               # global state
\`\`\`

## 5. Performance Checklist

- ✅ Avoid creating objects/arrays in JSX (causes re-renders)
- ✅ Use keys properly in lists (stable IDs, not index)
- ✅ Memoize expensive calculations with \`useMemo\`
- ✅ Stable callbacks with \`useCallback\`
- ✅ Lazy-load heavy routes/components
- ✅ Virtualize long lists (react-window)
  `.trim(), `
# Паттерны и лучшие практики React

## 1. Составные компоненты (Compound Components)

\`\`\`jsx
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}
\`\`\`

## 2. Error Boundaries

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return <ErrorFallback />
    return this.props.children
  }
}
\`\`\`

## 3. Оптимизация производительности

\`\`\`jsx
// React.memo — пропускать ре-рендер при неизменных props
const ExpensiveList = React.memo(function({ items }) {
  return items.map(item => <Item key={item.id} item={item} />)
})

// Ленивая загрузка
const HeavyChart = React.lazy(() => import('./HeavyChart'))
\`\`\`

## 4. Структура папок

\`\`\`
src/
├── components/   # переиспользуемый UI
├── features/     # функциональные модули
├── hooks/        # пользовательские хуки
├── lib/          # утилиты, API-клиенты
└── pages/        # компоненты уровня роута
\`\`\`
  `.trim())

  console.log('  ✓ React specialization seeded')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function theory(
  db: PrismaClient,
  chapterId: string,
  slug: string,
  titleEn: string,
  titleRu: string,
  order: number,
  xpReward: number,
  contentEn: string,
  contentRu: string,
) {
  return db.lesson.upsert({
    where: { chapterId_slug: { chapterId, slug } },
    update: {},
    create: { chapterId, slug, type: 'theory', titleEn, titleRu, order, xpReward, contentEn, contentRu, isPublished: true, estimatedMin: 15 },
  })
}
