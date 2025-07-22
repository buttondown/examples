---
layout: default
title: Home
---

# Welcome to our Newsletter Example

This is a simple Jekyll site demonstrating how to integrate Buttondown newsletter subscriptions into your Jekyll website.

## Features

- Static site generation with Jekyll
- Integrated newsletter subscription form
- Client-side form handling with vanilla JavaScript
- Responsive design
- No additional dependencies required

## Recent Posts

{% for post in site.posts %}
  <article>
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <time>{{ post.date | date: "%B %d, %Y" }}</time>
    <p>{{ post.excerpt }}</p>
  </article>
{% endfor %}

## Getting Started

Check out the [about page]({{ "/about/" | relative_url }}) to learn more about this example.