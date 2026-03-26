# Reaction Speed Game

An interactive reaction-speed mini-game built with **Angular 21**, SCSS, and modern Web APIs.

## Game Rules

1. Enter **Milliseconds** — the time limit in milliseconds for each round.
2. Click **Start** to begin.
3. A random blue cell turns **yellow**. Click it before N ms elapse!
   - ✅ Click in time → cell turns **green**, **Player** scores 1 point.
   - ❌ Time runs out → cell turns **red**, **Computer** scores 1 point.
4. First to **10 points** wins. A modal announces the result.

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Angular 21 (standalone, no NgModules) |
| Styling | SCSS with CSS custom properties |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| Change detection | `ChangeDetectionStrategy.OnPush` on every component |
| Modal | Native HTML `<dialog>` element |
| Build | Angular CLI / `@angular/build` (esbuild) |

## Project Structure

```
src/
└── app/
    ├── app.ts                        # Root component
    ├── app.config.ts                 # Application config
    └── features/
        └── game/
            ├── models/
            │   └── game.model.ts     # Interfaces, types, constants
            ├── services/
            │   └── game.service.ts   # Game logic (signals-based state)
            └── components/
                ├── game-container/   # Layout orchestrator
                ├── game-board/       # 10×10 grid
                ├── game-cell/        # Individual cell button
                ├── game-controls/    # Start button + N input
                ├── game-score/       # Scoreboard with pip indicators
                └── game-modal/       # Result modal
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 22
- npm ≥ 10

### Install & Run

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build for Production

```bash
npm run build
```

Output is placed in `dist/reaction-speed-game/browser/`.
