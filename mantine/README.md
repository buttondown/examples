# Mantine Buttondown Example

A newsletter subscription form built with Mantine, React, and Buttondown.

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `postcss.config.js` file:

```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

4. Create a `app/layout.tsx` file:

```tsx
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
```

5. Replace `{username}` in `basic.tsx` with your Buttondown username

6. Run the development server:

```bash
npm run dev
```

7. Open http://localhost:3000 in your browser

## Features

- Form validation with Mantine's form hook
- Uncontrolled form mode for better performance
- Name and email field validation
- Clean, minimal UI with Mantine components
- TypeScript support

## Notes

The example uses:
- Uncontrolled form mode for performance optimization
- Built-in Mantine form validations (client-side)
- Buttondown's server-side validations as backup