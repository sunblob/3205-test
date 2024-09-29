# Запуск проекта

## Без Docker

### 1. Установить PNPM на ПК

```bash
corepack enable pnpm
```

### 2. Установить зависимости

```bash
pnpm i
```

### 3. Запустить проект в dev режиме

```bash
pnpm dev
```

## Docker

### 1. Запустить через docker compose

```bash
docker compose up -d
```

- Проект будет доступен по адресу **localhost:8080**
- Сервер доступен по адресу **localhost:3000**

**Made with [Vue](https://vuejs.org/) and [Hono](https://hono.dev)**
