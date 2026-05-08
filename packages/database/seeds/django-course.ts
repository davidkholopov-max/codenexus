import { PrismaClient } from '@prisma/client'

export async function seedDjangoCourse(db: PrismaClient) {
  console.log('  Seeding Django specialization...')

  const existing = await db.course.findUnique({ where: { slug: 'django-web' } })
  if (existing) { console.log('  Django course already exists, skipping.'); return }

  // Привязываемся к родительскому Python курсу
  const parent = await db.course.findUnique({ where: { slug: 'python-basics' } })
  if (!parent) {
    console.log('  Python course not found — seed Python first!')
    return
  }

  const course = await db.course.create({
    data: {
      slug: 'django-web',
      language: 'python',
      titleEn: 'Django: Web Development',
      titleRu: 'Django: веб-разработка',
      descriptionEn: 'Build real web applications with Django — the batteries-included Python web framework. Models, views, templates, REST API, and deployment.',
      descriptionRu: 'Создавайте настоящие веб-приложения с Django — «батарейками в комплекте». Модели, представления, шаблоны, REST API и деплой.',
      level: 3,
      totalXP: 500,
      isPublished: true,
      parentCourseId: parent.id,
    },
  })

  // ─── Chapter 1: Django Basics ─────────────────────────────────────────────
  const ch1 = await db.chapter.create({
    data: { courseId: course.id, slug: 'django-fundamentals', order: 1, titleEn: 'Django Fundamentals', titleRu: 'Основы Django' },
  })

  await theory(db, ch1.id, 'what-is-django', 'What is Django?', 'Что такое Django?', 1, 10, `
# What is Django?

Django is a **high-level Python web framework** that encourages rapid development and clean, pragmatic design. Created in 2003 at a newspaper company, it powers Instagram, Pinterest, Disqus, and Mozilla.

## Django's Philosophy

- **"Batteries included"** — comes with everything: ORM, admin panel, authentication, templating, forms, security
- **DRY (Don't Repeat Yourself)** — one source of truth
- **MVT Architecture** — Model → View → Template

## MVT vs MVC

| Django | Traditional MVC |
|--------|----------------|
| Model | Model |
| View (business logic) | Controller |
| Template | View |

## Project Structure

\`\`\`
myproject/
├── manage.py           # CLI tool
├── myproject/
│   ├── settings.py     # configuration
│   ├── urls.py         # URL routing
│   └── wsgi.py         # WSGI entry point
└── myapp/
    ├── models.py       # database models
    ├── views.py        # request handlers
    ├── urls.py         # app URL routes
    └── templates/      # HTML templates
\`\`\`

## Quick Start

\`\`\`bash
pip install django
django-admin startproject myproject
cd myproject
python manage.py startapp myapp
python manage.py runserver  # → http://localhost:8000
\`\`\`

## URL routing

\`\`\`python
# myapp/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('posts/<int:pk>/', views.post_detail, name='post-detail'),
]
\`\`\`
  `.trim(), `
# Что такое Django?

Django — **высокоуровневый веб-фреймворк на Python**, поощряющий быструю разработку и чистый дизайн. Создан в 2003 году, сегодня используется Instagram, Pinterest, Disqus, Mozilla.

## Философия Django

- **«Батарейки в комплекте»** — ORM, панель администратора, аутентификация, шаблоны, формы, безопасность
- **DRY (Don't Repeat Yourself)** — один источник истины
- **MVT-архитектура** — Model → View → Template

## Структура проекта

\`\`\`
myproject/
├── manage.py           # утилита командной строки
├── myproject/
│   ├── settings.py     # конфигурация
│   ├── urls.py         # маршрутизация URL
│   └── wsgi.py         # точка входа WSGI
└── myapp/
    ├── models.py       # модели БД
    ├── views.py        # обработчики запросов
    ├── urls.py         # маршруты приложения
    └── templates/      # HTML-шаблоны
\`\`\`

## Быстрый старт

\`\`\`bash
pip install django
django-admin startproject myproject
python manage.py startapp myapp
python manage.py runserver
\`\`\`
  `.trim())

  await theory(db, ch1.id, 'django-models', 'Models and ORM', 'Модели и ORM', 2, 12, `
# Django Models and ORM

Django's ORM lets you define your database schema in Python — no raw SQL needed.

## Defining Models

\`\`\`python
# myapp/models.py
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

class Post(models.Model):
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts')
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
\`\`\`

## Migrations

\`\`\`bash
python manage.py makemigrations  # generate migration files
python manage.py migrate         # apply to database
\`\`\`

## QuerySet API

\`\`\`python
# Create
author = Author.objects.create(name="Alice", email="alice@example.com")

# Read
all_posts = Post.objects.all()
published = Post.objects.filter(published=True)
post = Post.objects.get(slug="my-first-post")

# Filter with lookups
recent = Post.objects.filter(created_at__gte=some_date)
search = Post.objects.filter(title__icontains="django")

# Update
Post.objects.filter(author=author).update(published=True)

# Delete
Post.objects.filter(published=False).delete()

# Aggregation
from django.db.models import Count, Avg
Post.objects.aggregate(total=Count('id'))

# Related objects
alice_posts = author.posts.filter(published=True)
\`\`\`

## Field Types

| Field | Use case |
|-------|----------|
| \`CharField(max_length=)\` | Short text |
| \`TextField()\` | Long text |
| \`IntegerField()\` | Integer numbers |
| \`DecimalField()\` | Precise decimals (prices) |
| \`BooleanField()\` | True/False |
| \`DateTimeField()\` | Date + time |
| \`ForeignKey()\` | Many-to-one relation |
| \`ManyToManyField()\` | Many-to-many relation |
| \`ImageField()\` | Image uploads |
  `.trim(), `
# Модели и ORM в Django

ORM Django позволяет определять схему БД на Python — без написания SQL вручную.

## Определение моделей

\`\`\`python
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts')
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
\`\`\`

## Миграции

\`\`\`bash
python manage.py makemigrations  # создать файлы миграции
python manage.py migrate         # применить к БД
\`\`\`

## QuerySet API

\`\`\`python
# Создание
author = Author.objects.create(name="Алиса", email="alice@example.com")

# Чтение
all_posts = Post.objects.all()
published = Post.objects.filter(published=True)
post = Post.objects.get(slug="my-first-post")

# Поиск (регистронезависимо)
Post.objects.filter(title__icontains="django")

# Обновление
Post.objects.filter(author=author).update(published=True)

# Удаление
Post.objects.filter(published=False).delete()

# Связанные объекты
alice_posts = author.posts.filter(published=True)
\`\`\`
  `.trim())

  // ─── Chapter 2: Views and Templates ──────────────────────────────────────
  const ch2 = await db.chapter.create({
    data: { courseId: course.id, slug: 'django-views-templates', order: 2, titleEn: 'Views and Templates', titleRu: 'Представления и шаблоны' },
  })

  await theory(db, ch2.id, 'django-views', 'Function-Based and Class-Based Views', 'FBV и CBV', 1, 12, `
# Django Views

A **view** is a Python function or class that receives a request and returns a response.

## Function-Based Views (FBV)

\`\`\`python
# myapp/views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Post

def post_list(request):
    posts = Post.objects.filter(published=True).order_by('-created_at')
    return render(request, 'blog/post_list.html', {'posts': posts})

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)
    return render(request, 'blog/post_detail.html', {'post': post})

def post_api(request):
    posts = list(Post.objects.filter(published=True).values('id', 'title', 'slug'))
    return JsonResponse({'posts': posts})
\`\`\`

## Class-Based Views (CBV)

\`\`\`python
from django.views.generic import ListView, DetailView, CreateView
from django.urls import reverse_lazy

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(published=True)

class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
    slug_field = 'slug'

class PostCreateView(CreateView):
    model = Post
    fields = ['title', 'content', 'published']
    success_url = reverse_lazy('post-list')
\`\`\`

## Django Templates

\`\`\`html
<!-- templates/blog/post_list.html -->
{% extends "base.html" %}
{% block content %}

<h1>Blog Posts</h1>

{% for post in posts %}
  <article>
    <h2><a href="{% url 'post-detail' post.slug %}">{{ post.title }}</a></h2>
    <p>By {{ post.author.name }} · {{ post.created_at|date:"F j, Y" }}</p>
    <p>{{ post.content|truncatewords:30 }}</p>
  </article>
{% empty %}
  <p>No posts yet.</p>
{% endfor %}

{% if is_paginated %}
  {% if page_obj.has_previous %}
    <a href="?page={{ page_obj.previous_page_number }}">← Previous</a>
  {% endif %}
  <span>Page {{ page_obj.number }} of {{ page_obj.num_pages }}</span>
  {% if page_obj.has_next %}
    <a href="?page={{ page_obj.next_page_number }}">Next →</a>
  {% endif %}
{% endif %}

{% endblock %}
\`\`\`
  `.trim(), `
# Представления Django

**View** — функция или класс, который принимает запрос и возвращает ответ.

## Function-Based Views (FBV)

\`\`\`python
from django.shortcuts import render, get_object_or_404
from .models import Post

def post_list(request):
    posts = Post.objects.filter(published=True).order_by('-created_at')
    return render(request, 'blog/post_list.html', {'posts': posts})

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)
    return render(request, 'blog/post_detail.html', {'post': post})
\`\`\`

## Class-Based Views (CBV)

\`\`\`python
from django.views.generic import ListView, DetailView

class PostListView(ListView):
    model = Post
    template_name = 'blog/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(published=True)
\`\`\`

## Шаблоны Django

\`\`\`html
{% extends "base.html" %}
{% block content %}

{% for post in posts %}
  <article>
    <h2><a href="{% url 'post-detail' post.slug %}">{{ post.title }}</a></h2>
    <p>{{ post.created_at|date:"j F Y" }}</p>
  </article>
{% empty %}
  <p>Постов пока нет.</p>
{% endfor %}

{% endblock %}
\`\`\`
  `.trim())

  // ─── Chapter 3: Django REST Framework ────────────────────────────────────
  const ch3 = await db.chapter.create({
    data: { courseId: course.id, slug: 'django-rest-api', order: 3, titleEn: 'REST API with DRF', titleRu: 'REST API с DRF' },
  })

  await theory(db, ch3.id, 'drf-intro', 'Django REST Framework', 'Django REST Framework', 1, 15, `
# Django REST Framework (DRF)

DRF is the standard library for building REST APIs with Django. Used by Instagram, Mozilla, Red Hat.

\`\`\`bash
pip install djangorestframework
\`\`\`

\`\`\`python
# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
]
\`\`\`

## Serializers

Serializers convert model instances to JSON (and back).

\`\`\`python
# myapp/serializers.py
from rest_framework import serializers
from .models import Author, Post

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'email', 'bio']

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'author', 'author_id', 'published', 'created_at']
        read_only_fields = ['slug', 'created_at']
\`\`\`

## ViewSets

\`\`\`python
# myapp/views.py
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(published=True)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.published = True
        post.save()
        return Response({'status': 'published'})
\`\`\`

## Router (auto-generates URLs)

\`\`\`python
# myproject/urls.py
from rest_framework.routers import DefaultRouter
from myapp.views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]
\`\`\`

## Auto-generated endpoints

| Method | URL | Action |
|--------|-----|--------|
| GET | /api/posts/ | List all posts |
| POST | /api/posts/ | Create a post |
| GET | /api/posts/{id}/ | Get a post |
| PUT | /api/posts/{id}/ | Update a post |
| DELETE | /api/posts/{id}/ | Delete a post |
| POST | /api/posts/{id}/publish/ | Custom action |

## Authentication

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
\`\`\`
  `.trim(), `
# Django REST Framework (DRF)

DRF — стандартная библиотека для REST API на Django. Используется Instagram, Mozilla, Red Hat.

\`\`\`bash
pip install djangorestframework
\`\`\`

## Сериализаторы

Конвертируют экземпляры модели в JSON (и обратно).

\`\`\`python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'published', 'created_at']
\`\`\`

## ViewSets

\`\`\`python
from rest_framework import viewsets, permissions

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(published=True)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
\`\`\`

## Router (автоматически генерирует URL)

\`\`\`python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
\`\`\`

## Автоматически создаваемые эндпоинты

| Метод | URL | Действие |
|-------|-----|----------|
| GET | /api/posts/ | Список постов |
| POST | /api/posts/ | Создать пост |
| GET | /api/posts/{id}/ | Получить пост |
| PUT | /api/posts/{id}/ | Обновить пост |
| DELETE | /api/posts/{id}/ | Удалить пост |
  `.trim())

  // ─── Chapter 4: Deployment ────────────────────────────────────────────────
  const ch4 = await db.chapter.create({
    data: { courseId: course.id, slug: 'django-deployment', order: 4, titleEn: 'Deployment', titleRu: 'Деплой' },
  })

  await theory(db, ch4.id, 'django-deployment', 'Deploying Django', 'Деплой Django', 1, 15, `
# Deploying Django

## Production Settings

\`\`\`python
# settings/production.py
import os
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

# Database (use PostgreSQL in production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
        'PORT': '5432',
    }
}

# Static files (served by nginx/CDN)
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
\`\`\`

## Gunicorn (WSGI server)

\`\`\`bash
pip install gunicorn
gunicorn myproject.wsgi:application --workers 4 --bind 0.0.0.0:8000
\`\`\`

## Docker Deployment

\`\`\`dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --no-input

EXPOSE 8000
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## Deployment Checklist

\`\`\`bash
python manage.py check --deploy  # Django's own checklist

# Before deploy:
python manage.py collectstatic
python manage.py migrate
\`\`\`

## Popular Hosting Options

| Platform | Complexity | Cost |
|----------|-----------|------|
| **Railway** | Easy | Free tier |
| **Render** | Easy | Free tier |
| **Heroku** | Easy | Paid |
| **DigitalOcean** | Medium | $6/month |
| **AWS EC2** | Complex | Pay per use |
  `.trim(), `
# Деплой Django

## Настройки для продакшена

\`\`\`python
# settings/production.py
import os
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
        'HOST': os.environ['DB_HOST'],
    }
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
\`\`\`

## Gunicorn (WSGI-сервер)

\`\`\`bash
pip install gunicorn
gunicorn myproject.wsgi:application --workers 4 --bind 0.0.0.0:8000
\`\`\`

## Docker

\`\`\`dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py collectstatic --no-input
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
\`\`\`

## Чеклист перед деплоем

\`\`\`bash
python manage.py check --deploy
python manage.py collectstatic
python manage.py migrate
\`\`\`
  `.trim())

  console.log('  ✓ Django specialization seeded')
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
    create: { chapterId, slug, type: 'theory', titleEn, titleRu, order, xpReward, contentEn, contentRu, isPublished: true, estimatedMin: 12 },
  })
}
