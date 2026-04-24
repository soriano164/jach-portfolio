# Soriano Portfolio

A modern, responsive personal portfolio website for showcasing design projects, creative direction, and contact information.

## Live Site

Published via GitHub Pages from this repository:
- [https://github.com/soriano164/soriano-portfolio](https://github.com/soriano164/soriano-portfolio)

## Features

- Component-based page sections loaded from `web/`
- Smooth section navigation with a fixed responsive navbar
- Mobile menu toggle and touch-friendly layout
- Horizontal project showcase with dot indicators
- Project preview modal for both SVG and image project cards
- Archive view route (`#projects-archive`) with full project listing
- Floating back-to-top action button near footer
- Scroll animations using AOS
- Visual motion effects using Anime.js

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- [AOS](https://michalsnik.github.io/aos/)
- [Anime.js](https://animejs.com/)
- Font Awesome

## Project Structure

```text
.
├── assets/          # Images and project media
├── css/             # Component and global styles
├── js/              # Component logic and app routing
├── web/             # HTML component partials
└── index.html       # Main entry point
```

## Run Locally

This project is static, so you can open `index.html` directly, but a local server is recommended.

Using VS Code Live Server:
1. Open the folder in VS Code
2. Right-click `index.html`
3. Click **Open with Live Server**

Or using Python:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Deployment

GitHub Pages is configured using GitHub Actions workflow:
- `.github/workflows/deploy-pages.yml`

On push to `main`, the site is automatically deployed.

## Author

Jacqueline Soriano  
Graphic Designer / UI-UX Creative
