# shadcn/ui Buttondown Examples

Newsletter subscription form examples built with shadcn/ui, React, and Buttondown.

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Initialize shadcn/ui:

```bash
npx shadcn-ui@latest init
```

Choose the following options:
- Would you like to use TypeScript? → Yes
- Which style would you like to use? → Default
- Which color would you like to use as base color? → Slate
- Where is your global CSS file? → app/globals.css
- Would you like to use CSS variables for colors? → Yes
- Where is your tailwind.config.js located? → tailwind.config.js
- Configure the import alias for components? → @/components
- Configure the import alias for utils? → @/lib/utils

4. Add required shadcn/ui components:

```bash
npm run ui:add button
npm run ui:add card
npm run ui:add input
npm run ui:add label
npm run ui:add select
```

5. Replace `{username}` in the component files with your Buttondown username

6. Run the development server:

```bash
npm run dev
```

7. Open http://localhost:3000 in your browser

## Examples

- `basic.tsx` - Simple email subscription form with card layout
- `dropdown.tsx` - Subscription form with language selection dropdown

## Features

- Modern, accessible UI components from shadcn/ui
- Responsive card-based layout
- Form validation
- Language selection with dynamic button text
- TypeScript support
- Tailwind CSS styling
- Radix UI primitives for accessibility

## Notes

The examples use:
- shadcn/ui components for consistent, accessible UI
- Radix UI primitives under the hood
- Tailwind CSS for styling
- Next.js App Router