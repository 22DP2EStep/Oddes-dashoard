# Supabase Vue.js Dashboard

A modern, responsive dashboard built with Vue.js 3, Vite, TypeScript, and Tailwind CSS that displays data from your Supabase tables with interactive charts and data visualization.

## Features

- 📊 **Interactive Dashboard** - Overview with statistics cards and charts
- 📋 **Data Tables** - Paginated tables with search and filtering
- 📈 **Charts & Visualization** - Bar, line, doughnut, and pie charts using Chart.js
- 🔄 **Real-time Updates** - Refresh functionality for latest data
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI** - Built with Tailwind CSS and Heroicons
- 🚀 **Fast Development** - Vite for lightning-fast builds
- 🛡️ **Type Safety** - Full TypeScript support

## Quick Start

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Configure Supabase**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials.

3. **Configure Your Table**
   See `DASHBOARD_SETUP.md` for detailed configuration instructions.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ChartWidget.vue     # Chart visualization component
│   ├── DataTable.vue       # Data table with pagination
│   ├── DashboardLayout.vue # Main layout component
│   └── StatCard.vue        # Statistics card component
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── services/
│   └── dataService.ts      # Data fetching and processing
├── views/
│   ├── HomeView.vue        # Dashboard overview page
│   └── DataView.vue        # Full data table page
└── types/
    └── database.ts         # TypeScript database types
```

## Technologies Used

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Flexible JavaScript charting library
- **Supabase** - Open source Firebase alternative
- **Vue Router** - Official router for Vue.js
- **Pinia** - Intuitive state management

## Configuration

This dashboard is designed to work with any Supabase table. Update the following:

1. **Table Configuration** (`src/views/HomeView.vue` and `src/views/DataView.vue`)
2. **Data Types** (`src/services/dataService.ts`)
3. **Environment Variables** (`.env.local`)

See `DASHBOARD_SETUP.md` for complete setup instructions.

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```
