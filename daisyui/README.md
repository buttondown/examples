# DaisyUI Buttondown Examples

Newsletter subscription form examples built with DaisyUI, React, and Buttondown.

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `tailwind.config.js` file:

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
```

4. Create a `postcss.config.js` file:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

5. Create a global CSS file at `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. Replace `{username}` in the component files with your Buttondown username

7. Run the development server:

```bash
npm run dev
```

8. Open http://localhost:3000 in your browser

## Examples

- `basic.tsx` - Simple email subscription form
- `dropdown.tsx` - Subscription form with language selection dropdown

## Features

- Responsive card-based layout
- DaisyUI styling components
- Form validation
- Language selection with dynamic button text
- Next.js App Router compatible