# QuizzieD! 🎯

A playful and animated React application built with Vite, TypeScript, and Framer Motion. QuizzieD explores what people ask every day through an engaging and colorful user interface with interactive trivia visualization.

## 🚀 Live Demo

Visit the live application: [QuizzieD on GitHub Pages](https://Izshin.github.io/QuizzieD/)

## Features

- **Animated Homepage**: Multi-colored gradient title with smooth animations
- **Interactive Trivia Dashboard**: Modular visualization components with charts and statistics
- **Cool Transitions**: Wave-like transition effect with a swinging question mark
- **Responsive Design**: Works on all screen sizes
- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Modular Architecture**: Component-based design with organized CSS structure
- **Smooth Animations**: Framer Motion for buttery animations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📦 Deployment

### GitHub Pages (Automatic)
This project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - GitHub Actions will automatically build and deploy
2. **Enable GitHub Pages** in repository settings (Settings → Pages → Source: GitHub Actions)
3. **Access your site** at `https://yourusername.github.io/QuizzieD/`

The deployment includes:
- ✅ SPA routing support via `404.html` fallback
- ✅ Proper base path configuration for GitHub Pages
- ✅ Automatic build and deployment workflow
- ✅ Asset optimization and caching

## Color Palette

The app uses a vibrant color scheme:
- Pink: #ec4899
- Purple: #8b5cf6  
- Sky: #0ea5e9
- Teal: #14b8a6
- Bright Pink: #ff0080
- And more vibrant colors!

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
