# Villa Profile Web

Static marketing website for a luxury private villa, built with Vite.

## Prerequisites

- Node.js 22+
- npm 10+
- Docker (for container builds)
- GNU Make

## Quick start

```bash
make install   # install dependencies
make run       # start dev server at http://localhost:5173
```

## Available commands

| Command | Description |
|---|---|
| `make install` | Install npm dependencies |
| `make run` | Start Vite dev server (hot reload) |
| `make build` | Production build → `dist/` |
| `make docker-build` | Build Docker image `villa-profile-web:latest` |
| `make docker-run` | Run container at http://localhost:8080 |

## Folder structure

```
villa-profile-web/
├── public/                 # Static assets served at root (no processing)
│   ├── images/             # Villa photos, hero images, etc.
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── css/
│   │   ├── tokens.css      # CSS custom properties — colors, type, spacing
│   │   └── global.css      # Base / reset styles
│   └── main.js             # JS entry point
├── index.html              # HTML shell with all semantic sections
├── Dockerfile              # Multi-stage build (Node → nginx), non-root
├── nginx.conf              # Hardened nginx config with security headers
├── Makefile                # Developer shortcuts
├── eslint.config.js        # ESLint v9 flat config
└── .github/
    ├── workflows/
    │   ├── ci.yml          # Build → lint → test → draft release (on push)
    │   └── release.yml     # Publish release (manual, semver input)
    └── PULL_REQUEST_TEMPLATE.md
```

## Image guidelines

All villa photos live in `public/images/`. Follow these rules to keep the page fast:

### Format

Use **WebP** for all photos. WebP gives 25–35% smaller files than JPEG at equivalent visual quality. Keep JPEG as a fallback only if a tool cannot output WebP.

### Sizing per section

| Section | File path pattern | Recommended size | Max file size |
|---|---|---|---|
| Hero background | `public/images/hero.webp` | 2560 × 1440 px | 300 kB |
| Pool main feature | `public/images/pool-main.webp` | 1800 × 1200 px | 200 kB |
| Pool gallery (×3) | `public/images/pool-*.webp` | 1200 × 800 px | 120 kB each |
| Room cards (×6) | `public/images/rooms/*.webp` | 900 × 600 px | 80 kB each |

### Compression settings

- **WebP quality**: 80–85 is the sweet spot for photographic content.
- **Hero image**: encode at quality 75 to stay under 300 kB — it renders behind an overlay so artefacts are invisible.
- Strip EXIF metadata before publishing (`exiftool -all= file.webp`).

### How to convert

```bash
# Single file — cwebp (from libwebp)
cwebp -q 82 input.jpg -o output.webp

# Batch — ImageMagick
mogrify -format webp -quality 82 public/images/rooms/*.jpg

# macOS GUI — Squoosh (squoosh.app) or ImageOptim with WebP plugin
```

### HTML usage

The `index.html` references images with plain `<img>` tags. Replace each `src` attribute with the corresponding `.webp` path. The hero image already carries `fetchpriority="high"`; all other images use `loading="lazy"`.

## Tech stack

| Layer | Tool |
|---|---|
| Build | [Vite](https://vite.dev) |
| Styles | Vanilla CSS with design tokens |
| Scripts | Vanilla JS (ES modules) |
| Linting | ESLint v9 |
| Testing | Vitest |
| Serving | nginx (Alpine, non-root) |
| CI/CD | GitHub Actions |
