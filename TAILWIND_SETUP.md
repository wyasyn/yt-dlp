# Tailwind CSS Setup

This Electron project has been configured with **Tailwind CSS v4**.

## Installed Packages

- `tailwindcss` - The main Tailwind CSS package
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind v4
- `postcss` - CSS post-processor
- `autoprefixer` - Adds vendor prefixes automatically

## Configuration Files

### 1. `tailwind.config.js`

Contains the Tailwind configuration with content paths for the renderer process:

```js
content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}']
```

### 2. `postcss.config.js`

PostCSS configuration that integrates Tailwind and Autoprefixer:

```js
plugins: {
  '@tailwindcss/postcss': {},
  autoprefixer: {},
}
```

### 3. `src/renderer/src/assets/main.css`

The main stylesheet imports Tailwind CSS:

```css
@import 'tailwindcss';
```

## Usage

### Using Tailwind Classes

Simply add Tailwind utility classes to your React components:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">Hello Tailwind!</div>
```

### Example Component

Check out `src/renderer/src/components/TailwindDemo.tsx` for a demo component showcasing various Tailwind features.

## Development

Run the dev server:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

## Important Notes

- Tailwind CSS only works in the **renderer process** (the UI)
- The main process and preload scripts don't have access to Tailwind
- All Tailwind classes used in your components will be automatically included in the final CSS bundle
- Unused classes are purged in production builds for optimal performance

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Electron Vite Documentation](https://electron-vite.org/)

## Notes

- This project uses Tailwind CSS v3 (stable) instead of v4 for better compatibility with Electron
- Tailwind v4 is still in beta and may have compatibility issues with some build tools
