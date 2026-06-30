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
