# PurpleLap

PurpleLap is a beginner-friendly sim-racing learning site. It combines practical driving guides with a wheel and wheelbase catalog, comparison tools, setup advice, and image credits.

**Live site:** [purplelap-sim.github.io/PurpleLap](https://purplelap-sim.github.io/PurpleLap/)

**Read this on the site:** [About PurpleLap](https://purplelap-sim.github.io/PurpleLap/readme.html)

## What’s in the site

- **Home page (`index.html`)** introduces the guides and offers quick search.
- **Gear guide (`gear-guide.html`)** lists 58 wheel and wheelbase models, with platform and brand filters, product details, wheel-shape labels, pricing, and a two-product comparison table and verdict.
- **Driving guides** cover racecraft, cornering, overtaking, car control, tire management, telemetry, race strategy, and related skills. See [`all-guides.html`](all-guides.html) for the guide directory.
- **Setup and learning pages** include controller setup, sim-racing position, building a setup, and finding a comfortable practice rhythm.
- **Photo credits (`photo-credits.html`)** lists the editorial photos, wheel product images, and site artwork. Image links open the local image in a new tab; available source and license information is included.
- **Feedback (`feedback.html`)** provides a way for visitors to share feedback.

## Project structure

| Path | Purpose |
| --- | --- |
| `*.html` | Site pages. Most content and page-specific styling are authored directly in each page. |
| `images/` | Editorial and guide photography. |
| `assets/wheels/` | Product images used by the gear guide. |
| `comparison-verdict.js` | Generates a concise comparison recommendation from documented product facts. |
| `comparison-options.js` | Filters a selected product out of the other comparison selector. |
| `wheel-shapes.js` | Maps gear-guide model IDs to included wheel-shape descriptions. |
| `back-navigation.js` | Makes guide back links return to the previous page when available. |
| `site-ui.js`, `site-ui.css` | Shared footer additions and back-to-top control. |
| `guide-media.css` | Shared responsive media styling for guide pages. |
| `photo-credits.js` | Photo-credit data and renderer for `photo-credits.html`. |
| `test/` | Focused tests for the comparison, navigation, photo credits, and wheel-shape behavior. |

There is no build step or package manifest; the site is served as static files.

## Run locally

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`.

## Tests

Tests use Node.js’s built-in test runner and do not require third-party packages:

```sh
node --test test/*.test.js
```

For HTML, CSS, or asset-only changes, also check whitespace and conflict markers:

```sh
git diff --check
```

## Updating content

- Keep product claims tied to the facts recorded in `gear-guide.html`; comparisons should not assume an unlisted feature or compatibility.
- Keep each catalog entry’s ID consistent with its keys in `wheel-shapes.js` and any comparison facts. The wheel-shape test checks coverage of the catalog.
- When adding or replacing a local image used on a page, add its path and available creator, source, and license details to `photo-credits.js`. If the source is unknown, say so rather than guessing. Product images are listed individually in that file.
- Shared footer behavior belongs in `site-ui.js` and its appearance in `site-ui.css`; individual pages may also have their own footer markup and styles.
- Keep guide pages useful on narrow screens and preserve accessible labels for interactive controls and image alternatives.

## Publishing

GitHub Pages serves the repository’s `main` branch from its root directory. Merge the reviewed site changes into `main` to publish them. The public site is:

https://purplelap-sim.github.io/PurpleLap/
