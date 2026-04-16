# Lockena Telegram Mini-App

Telegram WebApp клиент для Lockena.

---

## Платформа

Telegram WebApp

Ограничения:

- Работает внутри Telegram
- Использует initData для первичной аутентификации

---

## Аутентификация

1. Telegram передаёт initData
2. Backend валидирует подпись Telegram
3. Выдаются JWT и Refresh токены
4. Далее используется стандартная схема авторизации

---

## Интеграция

- Использует тот же API
- Использует ту же модель шифрования
- Zero-knowledge полностью сохраняется

---

## Локальный запуск (без Docker)

### Предварительные требования

- Node.js 20+
- npm или pnpm
- Запущенный [Lockena.Backend](../Lockena.Backend/README.md)

### Шаги

1. Клонировать репозиторий:

```bash
git clone https://github.com/kindast/lockena-frontend.git
cd /Lockena/lockena-frontend
```

Установить зависимости:

```bash
npm install
```

или

```bash
pnpm install
```

Настроить переменную окружения API:

Создать .env или .env.local:
`VITE_API_URL=https://localhost:5000`

Запустить dev‑сервер:

```bash
npm run dev
```

Открыть приложение в браузере (обычно <https://localhost:5173>)
