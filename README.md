# SynciNote

A simple, elegant note-taking app with Markdown support and AI assistance. Built with Svelte 5 and SvelteKit.

## Features

* **WYSIWYG Markdown Editor** — Powered by [Milkdown](https://milkdown.dev) with Crepe theme
* **AI Assistant** — Generate and refine notes using Google Gemini (bring your own API key)
* **Local-First** — All notes stored in your browser via IndexedDB (Dexie)
* **Search & Organize** — Full-text search across note titles
* **Export** — Download all notes as individual `.md` files in a ZIP archive
* **Responsive** — Works on desktop and mobile

## Tech Stack

* [Svelte 5](https://svelte.dev) / [SvelteKit](https://kit.svelte.dev)
* [Milkdown](https://milkdown.dev) — Markdown editor framework
* [Dexie](https://dexie.org) — IndexedDB wrapper
* [Google GenAI](https://ai.google.dev) — Gemini API
* [Tailwind CSS 4](https://tailwindcss.com) + [DaisyUI 5](https://daisyui.com)
* [TypeScript](https://www.typescriptlang.org)

- [ ] Hosted on [Vercel](https://vercel.com)

## Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### AI Assistant Setup

1. Go to **Settings** (⚙️ icon in the editor toolbar)
2. Enter your [Gemini API key](https://aistudio.google.com/apikey) and Save
3. Click the **Ask AI** button in the editor to generate or modify content

## Build

```bash
npm run build
npm run preview
```

##### NOTE: This project has been migrated from TanStack Start (Beta Version) to SvelteKit

