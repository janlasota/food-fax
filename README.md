# food-fax

Visualize the nutrients in your food

## Tech Stack

- React 19
- Vite 7.0
- TypeScript
- Tailwind
- Shadcn
- React Hook Form
- Recharts

## Before you Get Started

This project requires Node.js version 20.10.0 or later due to Vite 7.0.0 compatibility. If you encounter the error `TypeError: crypto.hash is not a function`, make sure to upgrade your Node.js version. You can find that issue reported [here](https://github.com/vitejs/vite/issues/20287).

### Check your Node.js version:

```bash
node --version
```

### Install/Upgrade Node.js:

- **macOS**: Use [nvm](https://github.com/nvm-sh/nvm) or download from [nodejs.org](https://nodejs.org/)
- **Windows**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager or [nvm](https://github.com/nvm-sh/nvm)

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd food-fax
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL displayed in the terminal, which should be `http://localhost:5173`.

## Future Plans

- Wire in a database so custom foods save across sessions
- Create another page with a table that tracks the custom foods you've created
