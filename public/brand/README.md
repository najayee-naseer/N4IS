# N4IS brand assets

The official N4IS logo is the primary brand asset for n4is.business. It is used
exactly as supplied — never recoloured, redrawn, stretched or replaced with a
text-only mark.

| File | What it is | Where it is used |
| --- | --- | --- |
| `n4is-logo.png` | The supplied artwork, unmodified (1254 × 1254) | Source of truth. Not referenced directly by the site. |
| `n4is-lockup.png` | The full lockup — wordmark, ™ and the "Ideas for a smarter tomorrow" line — trimmed to the artwork with even margins | Footer, loading screen, Open Graph card |
| `n4is-wordmark.png` | The `n4is` wordmark alone, trimmed | Header |
| `n4is-monogram.png` | The blue `n`, squared | Favicon and app icon (`src/app/icon.png`, `src/app/apple-icon.png`) |
| `archive/n4is-logo-legacy.png` | The previous hexagonal mark | Kept as a historical record only. Not used anywhere on the site. |

## Derived files

Every crop above comes from `n4is-logo.png` by trimming only — no scaling of one
axis, no recolouring, no added effects. The one normalisation applied is that
the artwork's near-white paper (any pixel at 250/255 or above on all channels)
was set to pure `#FFFFFF` so the mark sits seamlessly on the site's white
ground. Every pixel belonging to the logo, including its anti-aliased edges,
falls below that threshold and is untouched.

## Colour

The accent system is sampled from the logo artwork:

- `#0A6BFF` — N4IS blue, the primary accent
- `#00A6FF` — the bright cyan-blue in the gradient
- `#0046C4` — the deep blue in the `n`

These are the `--accent`, `--accent-bright` and `--accent-deep` tokens in
`src/styles/tokens.css`.

## The founder portrait

The supplied founder photograph is stored separately at
`public/images/founder.png` and is used as supplied.
