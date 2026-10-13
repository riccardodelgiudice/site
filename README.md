# Riccardo Del Giudice — Portfolio & Blog

A responsive, 90s-inspired portfolio-blog built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Add a blog article

Create a new `.md` file inside `src/content/posts/`. Copy the frontmatter below, then write the article using Markdown paragraphs, `##` headings, and `-` lists.

```md
---
title: Your article title
slug: your-article-slug
date: 2026-10-13
excerpt: A short description shown in the article list.
tags: first-tag, second-tag
readingTime: 4 min read
---

Your article starts here.
```

The post appears automatically on the homepage, in search, and in the archive. No component editing is required.

## Publish from VS Code

After editing the website or adding an article, commit and push the changes from the Source Control panel in VS Code. The GitHub Actions workflow builds the project and publishes it automatically to GitHub Pages.

Equivalent terminal commands:

```bash
git add .
git commit -m "Describe your changes"
git push
```

## Clean URLs

The site uses browser routes instead of hash links:

- `/blog`
- `/blog/your-article-slug`
- `/projects`

The GitHub Pages workflow creates a `404.html` fallback so these URLs can also be opened directly. `vercel.json`, `netlify.toml`, and `public/_redirects` provide the corresponding fallback on other supported hosts.
