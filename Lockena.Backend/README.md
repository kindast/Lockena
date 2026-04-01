# Lockena Backend

ASP.NET Core 10 API для менеджера паролей **Lockena**

---

## Назначение

Backend отвечает за:

- Аутентификацию пользователей
- Выдачу JWT и Refresh токенов
- Хранение зашифрованных записей
- Персистентность зашифрованного пользовательского ключа

Backend не выполняет криптографических операций над пользовательскими паролями.

---

## Архитектура

Слоистая архитектура:

```
Controllers
↓
Application Services
↓
Domain Models
↓
Infrastructure (EF Core)
```

---

## Структура проекта

- `Lockena.API` — слой представления (авторизация, контроллеры, маршрутизация)
- `Lockena.Application` — бизнес‑логика, DTO
- `Lockena.Domain` — доменные сущности и базовые абстракции
- `Lockena.Infrastructure` — реализация репозиториев, EF Core, миграции, работа с БД

---

## Стек

- .NET 10 / ASP.NET Core Web API
- PostgreSQL 
- Entity Framework Core для доступа к данным
- JWT‑аутентификация + refresh‑токены в HttpOnly cookie
- Docker + docker‑compose для локального и продакшн‑запуска

---

## Безопасность

### Токены

- JWT (15 минут)
- Refresh token (7 дней)

### Хранение данных

Backend хранит:
- Зашифрованные записи
- Зашифрованный пользовательский ключ

Backend не хранит:
- Производные ключи
- Расшифрованные данные

---

## Конфигурация

| Переменная                           | Назначение                      |
| ------------------------------------ | ------------------------------- |
| JwtSettings__SecretKey               | Секрет для подписи JWT          |
| ConnectionStrings__DefaultConnection | Строка подключения к PostgreSQL |
| AllowedCorsOrigins | Разрешенные CORS домены через ; (например, `https://localhost:5173`) |
| TelegramBotToken             | Токен Telegram бота для мини-приложения |
| LogoDevApiKey | API ключ от сервиса [Logo.dev](https://logo.dev) для логотипов (можно оставить пустым) |

---

## Запуск

### Без Docker

```bash
dotnet restore
dotnet ef database update
dotnet run
```

### Через Docker
```bash
docker-compose up backend
```
