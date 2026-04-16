# CLAUDE.md — food-fax

## Project Overview

food-fax is a single-page React app for visualizing nutritional data (calories, protein, carbs, fat) across multiple foods. Users can add foods manually or search via the Spoonacular Food API, then compare nutrients through bar, pie, and radial charts.

**Languages:** TypeScript (97%), JavaScript (3%)
**Frameworks & Libraries:** React 19.1.0, Vite 7.0, Tailwind CSS 4, Shadcn (Radix UI primitives), React Hook Form + Zod, Recharts 3
**Package Manager:** npm
**Deployment:** GitHub Pages via `npm run deploy` (gh-pages, base path `/food-fax/`)

## Project Structure

```
src/
  App.tsx                          # Root: renders <Dashboard /> full-screen (h-dvh w-dvw)
  main.tsx                         # React 19 createRoot entry
  index.css                        # Global styles
  types.ts                         # Shared enums and interfaces (Food, Ingredient, Category, ChartType)
  lib/utils.ts                     # cn() helper (clsx + tailwind-merge)
  data/dummyData.ts                # Seed food data used when no user data exists
  services/spoonacular.ts          # Spoonacular API client (requires VITE_ env var for API key)
  features/
    Dashboard/
      Dashboard.tsx                # Main feature component — state, layout, chart rendering
      Dashboard.utils.tsx          # Pure utility functions for dashboard data transforms
      components/
        AddFoodDialog.tsx          # Dialog + React Hook Form for manually entering food nutrients
        FoodCard.tsx               # Card displaying a single food's info with selection checkbox
        Instructions.tsx           # Onboarding instructions shown when no food is selected
        Legend.tsx                 # Chart legend component
        SpoonacularDialog.tsx      # Dialog for searching Spoonacular and importing food data
        index.ts                   # Re-exports all Dashboard sub-components
  components/
    ui/
      index.ts                     # Re-exports all UI primitives
      button.tsx                   # Shadcn Button
      checkbox.tsx                 # Shadcn Checkbox
      combobox.tsx                 # Combobox built on Command + Popover
      command.tsx                  # cmdk wrapper
      dialog.tsx                   # Shadcn Dialog
      form.tsx                     # React Hook Form + Radix Label integration
      input.tsx                    # Shadcn Input
      label.tsx                    # Shadcn Label
      popover.tsx                  # Shadcn Popover
      select.tsx                   # Shadcn Select
      spinner.tsx                  # Loading spinner
      tabs.tsx                     # Shadcn Tabs (used for switching ChartType)
      charts/
        chart.tsx                  # Recharts ChartContainer base wrapper
        bar-chart.tsx              # CustomBarChart — compares nutrients across foods
        pie-chart.tsx              # CustomPieChart — macro breakdown for a food
        radial-chart.tsx           # CustomRadialChart — alternate macro visualization
```

## Core Domain Types (`src/types.ts`)

```ts
enum Category { Protein | Fruit | Vegetable | Grain | Dairy | Nuts }
enum ChartType { Pie | Bar | Radial }

interface Food {
  id: string;
  name: string;
  category: Category;
  image?: string;
  calories: number;   // kcal
  protein: number;    // grams
  carbs: number;      // grams
  fat: number;        // grams
  servingSize: number;
  diameter?: number;
  isCustomFood?: boolean;
}

interface Ingredient {
  id: number;   // Spoonacular ingredient ID
  name: string;
  image: string;
}
```

Always use `Category` enum values (not raw strings) for food category fields. `isCustomFood` distinguishes user-entered foods from Spoonacular-imported or dummy data.

## Feature Architecture

All application state lives in `Dashboard.tsx`. There is no global state library (no Redux, no Zustand). The feature follows this pattern:
- `Dashboard.tsx` — owns state, passes props down
- `Dashboard.utils.tsx` — pure functions for transforming `Food[]` into chart-ready data
- `components/` — presentational components that receive props from Dashboard

Dialogs (`AddFoodDialog`, `SpoonacularDialog`) use React Hook Form with Zod validation. Form schemas are defined inside those component files.

## Spoonacular Integration (`src/services/spoonacular.ts`)

The Spoonacular API key must be set as a `VITE_` prefixed environment variable (read via `import.meta.env`). The `.envrc` file at the repo root is the expected local config location. `SpoonacularDialog.tsx` calls into `services/spoonacular.ts` to search ingredients and retrieve nutrient data, then maps the response to the `Food` interface before adding to Dashboard state.

## UI Component Conventions

- All reusable primitives live in `src/components/ui/` and are exported from `src/components/ui/index.ts`
- Charts are exported as `CustomBarChart`, `CustomPieChart`, `CustomRadialChart` — prefix `Custom` distinguishes them from Recharts primitives
- Shadcn components are composed from Radix UI + Tailwind; do not modify the Radix primitive behavior, only style via `className`
- Use `cn()` from `src/lib/utils.ts` for conditional class merging (wraps `clsx` + `tailwind-merge`)
- Chart type switching uses `<Tabs>` with `ChartType` enum values as tab identifiers

## Path Aliases

`@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.app.json`).

```ts
import { Food, Category } from "@/types";
import { cn } from "@/lib/utils";
import { CustomBarChart, Dialog } from "@/components/ui";
```

## Coding Conventions

- All components are PascalCase `.tsx` files
- Enums and interfaces are defined in `src/types.ts` and imported where needed — do not redefine local types that belong there
- Feature sub-components are re-exported from `src/features/Dashboard/components/index.ts`
- UI primitives are re-exported from `src/components/ui/index.ts`
- Avoid `any`; use the `Food` and `Ingredient` interfaces for all food data
- `isCustomFood?: boolean` must be set to `true` for user-created foods to distinguish them from seeded/API data

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Type-check + Vite production build
npm run lint         # ESLint (TypeScript + React Hooks rules)
npm run preview      # Preview production build locally
npm run deploy       # Build and publish to GitHub Pages
```

Requires Node.js >= 20.10.0 (Vite 7 uses `crypto.hash` unavailable in older versions).
