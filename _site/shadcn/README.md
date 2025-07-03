# shadcn/ui Buttondown Examples

Newsletter subscription form examples built with shadcn/ui styling, React, and Buttondown using CDN versions.

## Getting Started

1. Clone this repository
2. Replace `{username}` in the HTML files with your Buttondown username
3. Open the HTML files directly in your browser or serve them:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Examples

- `basic.html` - Simple email subscription form with card layout
- `dropdown.html` - Subscription form with language selection dropdown

## Features

- No build process required
- iframe-ready
- shadcn/ui-inspired styling via Tailwind CSS
- Responsive card-based layout
- Form validation
- Language selection with dynamic button text

## Notes

Both examples use CDN versions of all dependencies:
- Tailwind CSS via CDN with custom shadcn/ui theme configuration
- React via unpkg CDN (for dropdown example)
- Babel standalone for JSX transformation
- Can be embedded directly in iframes

The styling replicates shadcn/ui components without requiring the full build setup.