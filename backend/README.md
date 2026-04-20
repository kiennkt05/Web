# ClassicModels Backend Prototype

Simple Node.js backend for the prototype pages in `index.html`.

## Structure

```txt
backend/
  src/
    app.js
    server.js
    config/
      env.js
      db.js
    controllers/
      analyticsController.js
    repositories/
      analyticsRepository.js
    routes/
      analyticsRoutes.js
    services/
      dashboardService.js
      searchService.js
      statisticsService.js
      pivotService.js
      chatbotService.js
    db/
      schema.sql
      seed.sql
    scripts/
      initDb.js
```

## Run

1. Copy `.env.example` to `.env`.
2. Install dependencies:

```bash
npm install
```

3. Initialize database:

```bash
npm run db:init
```

4. Start server:

```bash
npm run dev
```

## API

- `GET /health`
- `GET /api/dashboard?year=2004`
- `GET /api/search?q=ford&type=products&country=&page=1&pageSize=12`
- `GET /api/statistics?tab=time&year=2004&metric=revenue`
- `GET /api/pivot?row=productLine&col=year&value=revenue`
- `POST /api/chatbot/ask` with JSON body: `{ "message": "doanh thu hien tai?" }`
