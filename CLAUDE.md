# CLAUDE.md — food-fax

## Project Overview

Food-fax is a nutrient visualization app. Users add foods (manually or via the Spoonacular API) and view their macronutrient breakdowns across multiple chart types. The entire app state lives in the `Dashboard` feature; there is no router and no global state library.

**Languages:** TypeScript (97%), JavaScript (3%)
**Frameworks & Libraries:** React 19.1.0, Vite 7.0, Tailwind CSS v4, Shadcn/Radix UI, React Hook Form + Zod, Recharts 3
**Package Manager:** npm
**Deployment:** GitHub Pages via `gh-pages` (`npm run deploy`)

## Project Structure

```
src/
  App.tsx                          # Root — renders Dashboard full-viewport
  main.tsx                         # React DOM entry point
  types.ts                         # Shared enums and interfaces (Food, Ingredient, Category, ChartType)
  index.css                        # Global styles (Tailwind base)
  lib/utils.ts                     # cn() helper (clsx + tailwind-merge)
  data/dummyData.ts                # Seed food data used on first load
  services/spoonacular.ts          # Spoonacular API client
  features/
    Dashboard/
      Dashboard.tsx                # Main feature component — owns all state
      Dashboard.utils.tsx          # Pure helpers for data aggregation / chart prep
      components/
        AddFoodDialog.tsx          # Manual food entry form (React Hook Form + Zod)
        SpoonacularDialog.tsx      # Spoonacular search + import flow
        FoodCard.tsx               # Per-food display card with macros
        Instructions.tsx           # Onboarding/help text
        Legend.tsx                 # Chart legend component
        index.ts                   # Re-exports all Dashboard components
  components/
    ui/
      button.tsx, checkbox.tsx, combobox.tsx, dialog.tsx,
      form.tsx, input.tsx, label.tsx, popover.tsx, select.tsx,
      spinner.tsx, tabs.tsx        # Shadcn-style Radix primitives
      charts/
        chart.tsx                  # Recharts wrapper / shared chart config
        bar-chart.tsx              # CustomBarChart
        pie-chart.tsx              # CustomPieChart
        radial-chart.tsx           # CustomRadialChart
      index.ts                     # Barrel: Button, Checkbox, Combobox, CustomBarChart,
                                   #   CustomPieChart, CustomRadialChart, Dialog,
                                   #   Spinner, Tabs, TabsList, TabsTrigger
```

## Core Domain Types (`src/types.ts`)

```ts
enum Category { Protein, Fruit, Vegetable, Grain, Dairy, Nuts }
enum ChartType { Pie, Bar, Radial }

interface Food {
  id: string;
  name: string;
  category: Category;
  image?: string;
  calories: number;
  protein: number;   // grams
  carbs: number;     // grams
  fat: number;       // grams
  servingSize: number;
  diameter?: number;
  isCustomFood?: boolean;
}

interface Ingredient {   // Spoonacular search result shape
  id: number;
  name: string;
  image: string;
}
```

Do not add new top-level types anywhere other than `src/types.ts`.

## Architecture Decisions

- **Single feature, no router.** `App.tsx` renders only `<Dashboard />` inside a full-viewport div. Do not add React Router.
- **State lives in `Dashboard.tsx`.** There is no context, Redux, or Zustand. Food list state, selected chart type, and dialog open/close state all belong here.
- **`Dashboard.utils.tsx`** contains pure functions (data aggregation, chart data transformation). Keep business logic here, not inside components.
- **Shadcn pattern for UI.** All generic UI primitives live under `src/components/ui/` and are re-exported from `src/components/ui/index.ts`. They wrap Radix UI primitives with Tailwind classes and CVA variants. Follow the existing pattern when adding new primitives.
- **Chart components are wrappers.** `CustomBarChart`, `CustomPieChart`, and `CustomRadialChart` wrap Recharts with the project's visual conventions. The shared config lives in `charts/chart.tsx`.
- **Forms use React Hook Form + Zod.** `AddFoodDialog.tsx` is the reference implementation. Use `@hookform/resolvers/zod` for schema validation.
- **Spoonacular is optional.** The API key comes from environment variables (`.envrc`). `src/services/spoonacular.ts` handles all API calls. The `SpoonacularDialog` gracefully handles missing keys.

## Path Alias

`@` maps to `./src`. Use `@/types`, `@/lib/utils`, `@/components/ui`, `@/features/Dashboard/...`, etc.

## Styling Conventions

- Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin — no `tailwind.config.js` file).
- Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) whenever combining conditional classes.
- Shadcn component variants use `class-variance-authority` (CVA).
- Icons come exclusively from `lucide-react`.

## Adding a New Food Category

1. Add the value to the `Category` enum in `src/types.ts`.
2. Add representative entries to `src/data/dummyData.ts`.
3. Update any category-to-color mappings in `Dashboard.utils.tsx` and `Legend.tsx`.

## Adding a New Chart Type

1. Add the value to the `ChartType` enum in `src/types.ts`.
2. Create `src/components/ui/charts/<name>-chart.tsx` following the pattern of `bar-chart.tsx`.
3. Export from `src/components/ui/index.ts`.
4. Add a `TabsTrigger` and conditional render in `Dashboard.tsx`.

## Common Commands

```bash
npm install        # install dependencies (requires Node >= 20.10.0)
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # eslint (typescript-eslint + react-hooks + react-refresh)
npm run preview    # preview production build
npm run deploy     # build + publish to GitHub Pages
```

## Node.js Version Requirement

Node.js >= 20.10.0 is required. Vite 7 uses `crypto.hash` which does not exist in older Node versions. Use nvm or download from nodejs.org.

## Spoonacular API Setup

Set `VITE_SPOONACULAR_API_KEY` in your environment (see `.envrc`). Without it, `SpoonacularDialog` will not be functional but the rest of the app works using `dummyData.ts` and manual food entry.
