# Jekyll Blog with Buttondown Newsletter Integration

A modern, responsive Jekyll blog template with built-in Buttondown newsletter integration. Features a clean design, mobile-friendly layout, and easy customization options.

## Features

- 📱 Fully responsive design
- 📧 Buttondown newsletter integration
- 🎨 Modern and clean UI
- 📝 Markdown-based blogging
- 🔍 SEO optimized
- 📊 RSS feed support
- 💬 Easy to customize
- 🚀 Fast page loads
- 📄 Pagination support

## Prerequisites

Before you begin, ensure you have the following installed:

- Ruby (version 2.5.0 or higher)
- RubyGems
- GCC and Make
- Git

## Quick Start

1. **Clone this repository:**
   ```bash
   git clone https://github.com/yourusername/jekyll-buttondown-blog.git
   cd jekyll-buttondown-blog
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Configure your site:**
   Edit `_config.yml` and update the following:
   - `title`: Your blog name
   - `email`: Your email address
   - `description`: Your blog description
   - `url`: Your domain (for production)
   - `buttondown_username`: Your Buttondown username
   - `buttondown_form_url`: Your Buttondown form URL

4. **Run the development server:**
   ```bash
   bundle exec jekyll serve
   ```

5. **View your site:**
   Open `http://localhost:4000` in your browser

## Buttondown Setup

### 1. Create a Buttondown Account

1. Go to [Buttondown.email](https://buttondown.email)
2. Sign up for a free account (supports up to 1,000 subscribers)
3. Verify your email address

### 2. Get Your Buttondown Credentials

1. Log in to your Buttondown dashboard
2. Go to Settings
3. Find your username (appears in your newsletter URL: `buttondown.email/YOUR_USERNAME`)
4. Your form URL will be: `https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME`

### 3. Update Jekyll Configuration

In `_config.yml`, update:

```yaml
buttondown_username: YOUR_USERNAME
buttondown_form_url: https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME
```

## Creating Content

### Blog Posts

Create new posts in the `_posts` directory with the filename format: `YYYY-MM-DD-title-of-post.md`

Example front matter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2024-01-25 10:00:00 -0000
categories: [category1, category2]
tags: [tag1, tag2, tag3]
author: "Your Name"
image: /assets/images/post-image.jpg  # Optional
---

Your post content here...
```

### Pages

Create new pages in the root directory or in folders. Example front matter:

```yaml
---
layout: page
title: "Page Title"
permalink: /custom-url/
---

Your page content here...
```

## Customization

### Styling

The main stylesheet is located at `assets/css/main.scss`. Key variables:

```scss
$primary-color: #5B21B6;      // Main brand color
$secondary-color: #7C3AED;    // Secondary brand color
$text-color: #1F2937;         // Main text color
$text-light: #6B7280;         // Light text color
$bg-color: #FFFFFF;           // Background color
$bg-gray: #F9FAFB;           // Gray background
$border-color: #E5E7EB;      // Border color
```

### Navigation

Edit the navigation menu in `_includes/header.html`:

```html
<ul class="nav-menu">
    <li><a href="{{ '/' | relative_url }}">Home</a></li>
    <li><a href="{{ '/about/' | relative_url }}">About</a></li>
    <li><a href="{{ '/blog/' | relative_url }}">Blog</a></li>
    <li><a href="{{ '/newsletter/' | relative_url }}">Newsletter</a></li>
    <li><a href="{{ '/contact/' | relative_url }}">Contact</a></li>
</ul>
```

### Newsletter Form Placement

The newsletter form can be included anywhere using:

```liquid
{% include buttondown-form.html %}
```

Current placements:
- Footer (all pages)
- End of blog posts
- Newsletter page
- Home page

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://USERNAME.github.io/REPOSITORY`

### Netlify

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Build command: `jekyll build`
4. Publish directory: `_site`

### Custom Domain

Update `_config.yml`:

```yaml
url: "https://yourdomain.com"
baseurl: ""
```

## File Structure

```
jekyll-buttondown-blog/
├── _config.yml          # Site configuration
├── _includes/           # Reusable components
│   ├── header.html
│   ├── footer.html
│   └── buttondown-form.html
├── _layouts/            # Page templates
│   ├── default.html
│   ├── home.html
│   ├── page.html
│   └── post.html
├── _posts/              # Blog posts
├── _sass/               # Sass partials
├── assets/              # CSS, JS, images
│   ├── css/
│   ├── js/
│   └── images/
├── index.md             # Home page
├── about.md             # About page
├── blog/                # Blog listing
├── newsletter.md        # Newsletter page
└── contact.md           # Contact page
```

## SEO Features

- Jekyll SEO Tag plugin for meta tags
- Open Graph support
- Twitter Card support
- XML sitemap generation
- RSS feed at `/feed.xml`

## Performance Tips

1. **Optimize images**: Use appropriate formats and sizes
2. **Minimize CSS/JS**: The template is already optimized
3. **Enable caching**: Configure your server appropriately
4. **Use a CDN**: For images and static assets

## Troubleshooting

### Common Issues

1. **Bundle install fails**
   ```bash
   gem install bundler
   bundle update
   ```

2. **JavaScript not working**
   - Check browser console for errors
   - Ensure `main.js` is loading

3. **Newsletter form not working**
   - Verify Buttondown credentials
   - Check form action URL
   - Test in incognito mode

### Getting Help

- Jekyll Documentation: https://jekyllrb.com/docs/
- Buttondown Documentation: https://docs.buttondown.email/
- Create an issue in this repository

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Credits

- Built with [Jekyll](https://jekyllrb.com/)
- Newsletter powered by [Buttondown](https://buttondown.email/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

Made with ❤️ by the Jekyll community