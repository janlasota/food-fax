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

4. Open your browser and navigate to the URL displayed in the terminal, which should be `http://localhost:5173`.

## Setting up Spoonacular API

This app integrates with the [Spoonacular Food API](https://spoonacular.com/food-api) to pull some food data. You'll need to set up an account to get an API key to use (I can also provide you with my API key for testing).

### 1. Create a Spoonacular Account

- Visit [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
- Sign up for a free account
- Navigate to **My Console > Profile & API Key**
- Copy your `API Key`

### 2. Configure your Environment

- Add your API key to the `.envrc` file:
  ```bash
  export VITE_SPOONACULAR_API_KEY=<your_api_key_here>
  ```
- Run the following command in your terminal to allow the environment variable changes:
  ```bash
  direnv allow .
  ```

### 3. Enable API Integration

- Once your API key is set, you can enable the Spoonacular API by clicking the top right button in the app

## Future Plans

- Wire in a database so custom foods save across sessions
- Create another page with a table that tracks the custom foods you've created
