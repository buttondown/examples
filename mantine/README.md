# Mantine Buttondown Example

A newsletter subscription form built with Mantine, React, and Buttondown using CDN versions.

## Getting Started

1. Clone this repository
2. Replace `{username}` in `basic.html` with your Buttondown username
3. Open the HTML file directly in your browser or serve it:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Features

- No build process required
- iframe-ready
- Form validation with Mantine's form hook
- Uncontrolled form mode for better performance
- Name and email field validation
- Clean, minimal UI with Mantine components

## Notes

The example uses CDN versions of all dependencies:
- Mantine Core, Form, and Hooks via unpkg CDN
- React via unpkg CDN
- Babel standalone for JSX transformation
- Can be embedded directly in iframes