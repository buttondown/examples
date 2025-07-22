# Jekyll Buttondown Example

A static website built with Jekyll featuring an integrated Buttondown newsletter subscription form.

## Getting Started

### Prerequisites

- Ruby 2.5 or higher
- RubyGems
- Bundler (`gem install bundler`)

### Setup

1. Clone this repository
2. Navigate to the Jekyll directory:
   ```bash
   cd jekyll
   ```

3. Install dependencies:
   ```bash
   bundle install
   ```

4. Update `_config.yml` and replace `{username}` with your Buttondown username:
   ```yaml
   buttondown_username: "your-actual-username"
   ```

5. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

6. Open http://localhost:4000 in your browser

## Features

- **Static Site Generation**: Jekyll converts Markdown files into a complete website
- **Newsletter Integration**: Buttondown subscription form embedded in every page
- **Blog Support**: Full blogging capabilities with posts, categories, and permalinks
- **Responsive Design**: Mobile-friendly layout
- **Client-side Form Handling**: JavaScript-powered form submission with status messages

## Project Structure

```
jekyll/
├── _config.yml          # Jekyll configuration
├── _layouts/           
│   └── default.html    # Main layout with newsletter form
├── _posts/             # Blog posts
│   └── 2025-07-22-welcome-to-jekyll.md
├── index.md            # Homepage
├── about.md            # About page
├── Gemfile             # Ruby dependencies
└── README.md           # This file
```

## Customization

### Styling
Edit the `<style>` section in `_layouts/default.html` to customize the appearance.

### Configuration
Update `_config.yml` to change site title, description, and other settings.

### Content
- Add new pages by creating `.md` files in the root directory
- Add blog posts in `_posts/` following the `YYYY-MM-DD-title.md` format

## Deployment

Jekyll sites can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

For GitHub Pages, simply push to a repository and enable Pages in settings.

## Notes

- The newsletter form uses client-side JavaScript to handle submissions
- No server-side code is required
- The form works in iframes
- All subscription data is handled by Buttondown