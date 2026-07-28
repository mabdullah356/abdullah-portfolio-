<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mabdullah356/abdullah-portfolio-/main/src/assests/Abdullah_logo.png">
    <img src="./src/assests/Abdullah_logo.png" alt="Abdullah Portfolio Logo" width="180">
  </picture>
</p>

<h1 align="center">Muhammad Abdullah — Developer Portfolio</h1>

<p align="center">
  <strong>Full-Stack Developer · UI/UX Designer · Creative Technologist</strong>
</p>

<p align="center">
  <a href="https://abdullah-portfolio-five.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-8A2BE2?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <a href="mailto:abdullahworld111@gmail.com">
    <img src="https://img.shields.io/badge/Contact-Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
  <a href="./public/CV.docx">
    <img src="https://img.shields.io/badge/Download-CV-00C853?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="Download CV">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" alt="Framer Motion">
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=white" alt="GSAP">
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white" alt="React Router 7">
</p>

---

## Overview

A production-ready, performant developer portfolio built with **React 19**, **Vite 6**, and **Tailwind CSS v4**. Features a curated showcase of 20+ full-stack projects, an interactive terminal bio widget, smooth scroll-triggered animations, and a responsive layout optimized for every device.

---

## Features

### Design & UX
- Minimalist gray-based theme with accent interactions
- Custom mouse cursor follower with context-aware labels
- 3D tilt effects on project cards and gallery images
- Parallax scrolling, marquee tickers, and scroll-triggered animations (GSAP ScrollTrigger)
- Full-screen lightbox gallery on project detail pages
- Draggable skill cards with magnetic hover badges

### Portfolio Showcase
- 20+ real-world projects across **MERN Stack**, **Next.js**, and **React**
- Filterable project grid with category tabs and localStorage persistence
- Detailed case-study pages for each project with tech architecture breakdowns
- Live demo and GitHub source links on every project

### Interactive Elements
- **Terminal Bio** — an in-page bash-style terminal widget with commands (`whoami`, `skills`, `projects`, etc.)
- Glitch/decoder text reveal animations on project hero titles
- Rotating availability badge
- Infinite auto-scrolling service marquees

### Performance & DX
- Built on Vite 6 for instant HMR and optimized builds
- Tree-shakeable icons via React Icons
- Lazy-loaded routes (ready for code-splitting)
- ESLint configured with React Hooks and React Refresh rules
- SPA rewrites configured for Vercel deployment

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/), [GSAP 3](https://gsap.com/) |
| **Routing** | [React Router DOM 7](https://reactrouter.com/) |
| **Icons** | [React Icons 5](https://react-icons.github.io/react-icons/) |
| **Linting** | [ESLint 9](https://eslint.org/) (flat config) |
| **Deployment** | [Vercel](https://vercel.com/) (SPA rewrites) |

---

## Project Structure

```
src/
├── assests/
│   ├── Abdullah.jpg              # Profile photo
│   ├── Abdullah_logo.png         # Site logo
│   ├── pointerImage.jpg          # Custom cursor asset
│   └── projects.json             # 20+ project data (titles, tech, images, links)
├── components/
│   ├── AboutMe.jsx               # Home / Hero page
│   ├── Contact.jsx               # Contact form page
│   ├── Footer.jsx                # Global footer (nav, socials, newsletter)
│   ├── Header.jsx                # Global navigation bar
│   ├── Project.jsx               # Individual project case study (926 lines)
│   ├── RecentWorks.jsx           # Portfolio grid with filter
│   ├── Resume.jsx                # Skills & education timeline
│   ├── Service.jsx               # Skills with progress bars
│   ├── SocialMedia.jsx           # Reusable social link component
│   └── TerminalBio.jsx           # Interactive bash-terminal widget
├── App.jsx                       # Root component with routing
├── App.css                       # Component-level styles
├── index.css                     # Tailwind import + globals
└── main.jsx                      # Entry point (BrowserRouter)
```

### Routes

| Path | Component | Description |
|---|---|---|
| `/` | `AboutMe` | Hero, bio, tech badges, CTA |
| `/services` | `Service` | Skills with animated progress bars |
| `/recent-work` | `RecentWorks` | Filterable project gallery |
| `/project/:id` | `Project` | Full case study / detail view |
| `/resume` | `Resume` | Skills breakdown & education timeline |
| `/contact` | `Contact` | Contact form & info cards |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/mabdullah356/abdullah-portfolio-.git
cd abdullah-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint the codebase
npm run lint
```

---

## Deployment

This project is pre-configured for **Vercel** (see [`vercel.json`](./vercel.json)):

```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The SPA rewrite rule ensures React Router handles all routes correctly on Vercel. Deploy by connecting your GitHub repository to Vercel, or using the CLI:

```bash
npm i -g vercel
vercel
```

The same setup works on **Netlify** with a `_redirects` file: `/* /index.html 200`.

---

## Projects Showcase

The portfolio includes **20+ projects** ranging from food delivery and social media clones to SaaS platforms and developer tools. All project metadata lives in [`src/assests/projects.json`](./src/assests/projects.json) — each entry includes:

- Title, category, type, and role
- Full tech stack (frontend / backend / services)
- UI/UX feature list
- Live demo and GitHub repository links
- Thumbnail and gallery images

**Highlight projects:**
- **PakBites** — Food ordering platform
- **Scholarly** — Learning management system
- **Guardly** — Password manager
- **Aventine OS** — macOS-style portfolio interface
- **EChat** — AI-powered chat application
- **BookSphere** — Book discovery & management

---

## Customization

To make this portfolio your own:

1. **Personal info** — Update name, bio, and contact details in `AboutMe.jsx` and `Footer.jsx`
2. **Projects** — Edit or extend `src/assests/projects.json` with your own project data
3. **Resume** — Update skills, education, and replace `public/CV.docx`
4. **Theme** — Modify colors, fonts, and spacing in `index.css` (Tailwind v4 CSS-first config)
5. **Social links** — Update URLs in `SocialMedia.jsx`
6. **Profile image** — Replace `src/assests/Abdullah.jpg`

---

## Author

**Muhammad Abdullah** (also known as Abdullah Khan)

- Portfolio: [abdullah-portfolio-five.vercel.app](https://muhammad-abdullah-me.vercel.app/)
- GitHub: [@mabdullah356](https://github.com/mabdullah356)
- Email: [abdullahworld111@gmail.com](mailto:abdullahworld111@gmail.com)
- LinkedIn: [Muhammad Abdullah](https://www.linkedin.com/in/mabdullah555/)
- Twitter/X: [@Btw_abdullahy](https://x.com/Btw_abdullahy)
- Instagram: [@00_abdullah_here](https://instagram.com/00_abdullah_here)
- Location: Faisalabad, Pakistan

---

## License

This project is open source and available under the [MIT License](./LICENSE).

---

<p align="center">
  <sub>Built with React 19 · Vite 6 · Tailwind CSS v4 · Framer Motion 12 · GSAP 3</sub>
</p>
<p align="center">
  <sub>© 2025 Muhammad Abdullah. All rights reserved.</sub>
</p>
