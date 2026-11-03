# Portfolio Website New with React (Basil Jose Portfolio)

A minimal, vinyl-inspired portfolio built with React, Vite, Motion, HTML, and CSS.

## Run

```sh
npm install
npm run dev
```

`npm run build` produces the site in `dist`. `npm run preview` previews that build.

## Design and content

- The palette uses only `#285991`, `#FFF7ED`, and shades or mixtures derived from those colors. No stock photos or other color accents are used.
- Buttons, navigation, CV panels, and skill chips use translucent glass styling with edge highlights and hover sheen. The turntable and square sleeves have matching glossy finishes. Reduced motion and reduced transparency preferences are respected.
- Desktop uses a wider content area and a 16:9 hero. Album covers are square on a full-width blue work section, with cream headings and controls. Vinyl records remain circular; tablet and mobile layouts reflow naturally.
- Six text-free, abstract album sleeves form a continuously looping row. All link to Basil's supplied poster portfolio at `https://bit.ly/4fL6q3q`; they are visual entry points to the same collection, not separate project claims.
- Hover or keyboard focus pauses the row and slides out the vinyl. Previous, pause/play, and next controls allow manual browsing. Touch and wheel interaction pause autoplay, and reduced-motion preferences start the row paused. Repeated sleeves are excluded from the tab order.
- The fictional sample projects have been removed. Add more albums when actual project links are available.
- CV details are in native expandable rows. Toolkit names preserve the supplied CV wording.
- Contact supports email, both phone numbers, and copying the email address.
- The turntable animation and opt-in synthesized music have independent controls. Reduced-motion preferences are respected.
- Fonts load from Google Fonts with local font fallbacks.

## Tests

Install Chromium once with `npx playwright install chromium`, then run `npm test`. Tests cover CV details, contact actions, album hover and navigation, touch, audio controls, palette tokens, reduced motion, and four viewport widths.
