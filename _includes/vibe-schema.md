# Vibe JSON schema

A vibe is a single JSON object that describes how the Paslen timer looks —
colors, digits and the ticks of the dial — and which playlist goes with it. Copy it
from any vibe page, or send it straight to the app with the **Copy & open in Paslen** button and tap **Paste** there.

The dial is a round drum with one tick per minute (25 for a work session): ticks up to
the current minute are *filled*, the rest *empty*; the 12 o'clock tick is a hollow
*marker* until the circle is full; big digits sit in the middle. Everything a vibe
leaves out is taken from the app theme.

Plain-text version of this document: <{{ '/vibes/schema.txt' | absolute_url }}>
Formal JSON Schema (draft 2020-12), for validation: <{{ '/vibes/schema.json' | absolute_url }}>

The whole JSON is limited to 20,000 characters. Top-level fields are optional; if you
include `backdrop`, it must contain a drawing source (`shape`, `svg` or `icon`).

```
{
  "name": string,
  "playlist": url,                        // Spotify, Yandex Music, Deezer, ...
  "colors": {
    "background": color | [color, ...],   // a list is a top-to-bottom gradient
    "accent", "dim", "marker", "markerFill", "notch", "shadow": color
  },
  "digits": { "shadowOffset": [x, y] },   // -30..30
  "ticks": {
    "styles": {
      "<name>": {
        "shape": "line" | "capsule" | "wedge" | "pixel" | "palm-leaf" | "pistol-round" | "rifle-round" | "coconut-frond" | "palm-tree",
        "icon": "<one of 80 names>", "iconStyle": "fill" | "outline",
        "svg": "<path data or <svg> fragment>", "stroke": 0..30, "fillRule": "nonzero" | "evenodd",
        "radial": true | false, "core": 0..1,
        "width": 0.5..100, "length": 0.2..3, "glow": 0..60, "glowStrength": 0.2..3, "notch": bool,
        "shadowOffset": [x, y]          // -50..50
      }
    },
    "filled": ["<name>", ...], "empty": ["<name>", ...],
    "major": "<name>" | { "filled": "<name>", "empty": "<name>", "every": 2..60 },
    "marker": "<name>",
    "gradient": color | [color, ...],
    "layout": "ring" | "scatter",
    "random": { "seed": int, "order": bool, "offset": -80..80, "rotation": -180..180, "scale": [min, max] }  // 0.2..3
  },
  "backdrop": {                           // one picture under the digits
    "shape": "<figured shape>", "svg": "<path data or <svg> fragment>", "icon": "<icon name>",
    "iconStyle": "fill" | "outline", "fillRule": "nonzero" | "evenodd",
    "stroke": 0..30, "size": 0.1..1.5, "rotation": -180..180, "offset": [x, y], "color": color  // offset -1..1
  }
}
```

## Schema fields

### Top level

| Field | Type | Notes |
|---|---|---|
| `name` | string | Vibe name |
| `playlist` | string | Link to a playlist in any music service; the timer's music button opens it |
| `colors` | object | See [colors](#colors) |
| `digits` | object | See [digits](#digits) |
| `ticks` | object | See [ticks](#ticks) |
| `backdrop` | object | A picture under the digits, see [backdrop](#backdrop) |

### colors

| Field | Type | Notes |
|---|---|---|
| `background` | color or `[color, ...]` | A list is a top-to-bottom gradient |
| `accent` | color | Digits, filled ticks, the clock and the buttons |
| `dim` | color | Empty ticks (default: `accent`) |
| `marker` | color | Outline of the 12 o'clock marker (default: the tick color) |
| `markerFill` | color | Inside of the marker (default: the top background color) |
| `notch` | color | Cross-line in a tick (default: `markerFill`) |
| `shadow` | color | Offset colored copy of digits and ticks; no shadow without it |

Colors are hex strings: `"#RGB"`, `"#RRGGBB"` or `"#AARRGGBB"`.

### digits

| Field | Type | Range |
|---|---|---|
| `shadowOffset` | `[x, y]` | each `-30..30`, in dp; needs `colors.shadow` |

### ticks

| Field | Type | Values |
|---|---|---|
| `styles` | object | Named tick styles: `{ "<name>": style }`, see [tick style](#tick-style) |
| `filled` | `["<name>", ...]` | Repeating pattern of filled ticks from minute 1: minute *i* uses item `(i - 1) mod length` |
| `empty` | `["<name>", ...]` | The same for empty ticks |
| `major` | `"<name>"` or object | Fixed style of every 5th minute (or every `every`-th), overrides the pattern: `{ "filled": "<name>", "empty": "<name>", "every": 2..60 }` |
| `marker` | `"<name>"` | Style of the hollow 12 o'clock marker (default: that tick's style) |
| `gradient` | color or `[color, ...]` | Color of filled ticks along the arc: the first color at minute 1, the last at the 12 o'clock tick; if omitted or empty, `accent`. On a light background the app reverses a gradient whose first color is darker than its last: write it from light to dark |
| `layout` | string | `"ring"` (around the drum) or `"scatter"` (random spots around the digits) |
| `random` | object | See [random](#random) |

#### Tick style

| Field | Type | Values |
|---|---|---|
| `shape` | string | `"line"` (flat bar), `"capsule"` (rounded bar, default), `"wedge"` (teardrop), `"pixel"` (glitchy blocks), or a [figured shape](#figured-shapes): `"palm-leaf"`, `"pistol-round"`, `"rifle-round"`, `"coconut-frond"`, `"palm-tree"` |
| `icon` | string | A built-in icon instead of `shape`, only for `major` ticks, see [icons](#icons) |
| `iconStyle` | string | `"fill"` or `"outline"` (good for empty ticks) |
| `svg` | string | A custom shape instead of `shape`: path data or an `<svg>` fragment, see [custom svg](#custom-svg) |
| `stroke` | number | `0..30`: outline width for svg, icons and figured shapes; 0 (default) fills the path |
| `fillRule` | string | `"nonzero"` or `"evenodd"` (for shapes with holes) |
| `radial` | bool | Icons, svg and figured shapes turn with the ring, top outwards (default `true`); `false` keeps them upright. The primitive `line`, `capsule`, `wedge` and `pixel` shapes always turn with the ring |
| `core` | number | `0..1` (default 0): a neon tube — a light core along the tick, as a share of its width, in the tick color lightened to white; `line` and `capsule` only. Pair it with a bright `glow`, e.g. `{ "shape": "capsule", "width": 6, "length": 1.3, "glow": 18, "glowStrength": 2.4, "core": 0.45 }` (Vice) |
| `width` | number | `0.5..100`; the standard filled tick is 15 wide, the empty one 3 |
| `length` | number | `0.2..3`, a multiplier of the standard length |
| `glow` | number | `0..60`, glow radius; 0 = none |
| `glowStrength` | number | `0.2..3`, glow brightness (default 1); 2–2.5 for neon |
| `notch` | bool | Cross-line in the middle of the tick (not for svg, icons or figured shapes) |
| `shadowOffset` | `[x, y]` | each `-50..50`; needs `colors.shadow` |

#### random

| Field | Type | Values |
|---|---|---|
| `seed` | int | Same seed, same picture on every device |
| `order` | bool | Pattern styles go to ticks randomly instead of in turn (`major` stays fixed) |
| `offset` | number | `-80..80`, how far a tick may move off the ring (ring layout only) |
| `rotation` | number | `-180..180`, how far a tick may turn, degrees |
| `scale` | `[min, max]` | each `0.2..3`, random tick size |

### Icons

80 built-in icons (case, `_` and spaces don't matter). When writing a new vibe, use tick
icons only in styles referenced by `major`, never in `filled`, `empty` or `marker`.
Icons may also be used in a `backdrop`; that picture is independent of the minute ticks.
The app still accepts icons in other tick styles for compatibility with saved vibes.
`skull`, `ghost`, `bone`, `sword`, `axe`, `mask-happy`, `mask-sad`, `eye`, `fire`, `flame`, `lightning`, `smiley`, `leaf`, `tree`, `tree-evergreen`, `tree-palm`, `flower`, `flower-lotus`, `flower-tulip`, `plant`, `cactus`, `clover`, `acorn`, `feather`, `mountains`, `waves`, `sun`, `moon`, `moon-stars`, `star`, `star-four`, `sparkle`, `cloud`, `cloud-lightning`, `snowflake`, `drop`, `rainbow`, `cat`, `dog`, `paw-print`, `bird`, `butterfly`, `fish`, `rabbit`, `bug`, `horse`, `coffee`, `pizza`, `cookie`, `cake`, `ice-cream`, `pepper`, `orange-slice`, `wine`, `rocket`, `planet`, `alien`, `atom`, `robot`, `lightbulb`, `gear`, `heart`, `crown`, `diamond`, `spade`, `club`, `trophy`, `key`, `anchor`, `hourglass`, `music-note`, `headphones`, `guitar`, `gift`, `balloon`, `umbrella`, `spiral`, `hexagon`, `triangle`, `circle`.

Icons and svg are fitted into `width` × (48 × `length`) keeping proportions: use width 18–32
for icons on `major` ticks; an svg tick is 12–20 wide when filled and 10–16 when empty.

### Custom svg

Draw the object vertically and elongated (clearly taller than wide) on a 24×24 grid, as the tick looks at 12 o'clock: centred on
x = 12, its point or head at the top (the outer end), never diagonally. For example, a
sword: `"M12 1L14 4V15H18V17.5H13V21H14.5V23H9.5V21H11V17.5H6V15H10V4Z"`. Build it from
several closed subpaths and cut holes for key details with `"fillRule": "evenodd"`;
absolute `M/L/H/V/C/Q/A/Z`, up to 600 characters; keep holes and gaps at least 2 units
wide. Use `stroke` only for line art. Prefer a [figured shape](#figured-shapes) or a
[ready-made svg](#ready-made-svg) when one fits.

Both tick svg and backdrop svg accept path data or an `<svg>` fragment containing `<path d="…">`
elements. The app accepts absolute and relative `M/L/H/V/C/S/Q/T/A/Z` commands; there
are hard limits of 8,000 characters and 800 commands per svg. The shorter budgets above
and below are writing recommendations, not parser limits. Draw directly in path coordinates:
group transforms, CSS, text and other SVG elements are not applied.

### Figured shapes

Leaves and cartridges from the built-in Paslen vibes are `shape` values: write the name, not
a path. They are drawn like an svg: fitted into `width` × length, turned with the ring (or
upright with `"radial": false`); with `"stroke": 1.5` and a slightly smaller `width` the same
shape becomes an outline for empty ticks.

| `shape` | Looks like | Style used in Paslen |
|---|---|---|
| `"palm-leaf"` | banana palm leaf with torn edges and a cut-out vein | `"width": 20, "length": 1.5` |
| `"pistol-round"` | short cartridge: round bullet, case, rim (Ocean Drive) | `"width": 13, "length": 0.95`; empty: `"stroke": 1.5, "width": 12, "length": 0.9` |
| `"rifle-round"` | long pointed cartridge, twice the pistol round; good for `major` | `"width": 18, "length": 1.7`; empty: `"stroke": 1.5, "width": 16, "length": 1.6` |
| `"coconut-frond"` | coconut palm frond arching to the right, drooping leaflets; good as an outlined [backdrop](#backdrop) | backdrop: `"stroke": 2, "size": 0.72, "rotation": 25` |
| `"palm-tree"` | synthwave palm silhouette: curved trunk, crown of solid drooping fronds with a ragged fringe underneath; a filled [backdrop](#backdrop) (Ocean Drive, Vice) | backdrop: `"size": 0.78`, no stroke |

For example: `"bullet": { "shape": "pistol-round", "width": 12, "length": 0.85, "glow": 8 }`.

### backdrop

One optional picture on the drum, under the digits and the ticks: a palm frond behind the
numbers, a moon, a skull. It stays upright (it does not turn with the ring).

| Field | Type | Values |
|---|---|---|
| `shape` / `svg` / `icon` | string | What to draw: a [figured shape](#figured-shapes), a custom svg or a built-in icon. At least one is required; `svg` and `icon` together are an error. Prefer one source; `svg` or a known `icon` overrides `shape` |
| `iconStyle` | string | `"fill"` (default) or `"outline"`, as in a tick style |
| `fillRule` | string | `"nonzero"` (default) or `"evenodd"`; preserves evenodd declared by an SVG fragment or a figured shape |
| `stroke` | number | `0..30`, outline width in dial units; 0 (default) fills the picture |
| `size` | number | `0.1..1.5`, side of the square it is fitted into, in diameters of the tick ring (default 0.8); keep it under ~0.75 so it stays inside the ticks |
| `rotation` | number | `-180..180`, clockwise turn in degrees (default 0) |
| `offset` | `[x, y]` | each `-1..1`, shift of its centre in radii of the tick ring (default `[0, 0]`) |
| `color` | color | Default: `dim`. Use a translucent `#AARRGGBB` color: the digits must stay readable on top |

An empty `backdrop` is an error. Primitive tick shapes (`line`, `capsule`, `wedge`,
`pixel`) are not backdrop shapes. If no source is recognized, the app omits the picture
and shows a warning while keeping the rest of the vibe. Invalid numeric ranges or SVG
syntax are errors. Leave out `backdrop` entirely when no picture is needed.

Drawing your own svg for a backdrop:

- It is a picture, not a tick: draw it as it should look on the screen, upright, in any
  proportions, on a 24×24 grid. It is fitted into the `size` square by its bounds, so the
  grid size itself doesn't matter.
- Filled silhouette (`stroke` 0 or left out): build it from closed subpaths (`Z`). Where parts
  overlap, draw every subpath in the same direction so they merge; cut real holes with
  `"fillRule": "evenodd"`.
- Outline (`"stroke": 1.5..3`): line art; open subpaths (no `Z`) are allowed for single lines.
- Absolute `M/L/H/V/C/Q/A/Z`, up to 2000 characters; prefer curves (`C`, `Q`) to long
  polylines. Keep details at least 1 unit apart: small ones blur behind the digits.
- Keep it simple and bold: one recognizable silhouette (a palm, a skyline, a moon, a wave)
  reads better than a detailed scene.
- `color` with alpha: `#AARRGGBB` puts the alpha first (`"#59139FA6"` is 35 % teal), not last as
  in CSS. 25–50 % alpha keeps the digits readable; a filled backdrop needs less than an outline.

For example, Ocean Drive's palm silhouette:
`"backdrop": { "shape": "palm-tree", "size": 0.78, "offset": [0, 0.02], "color": "#59139FA6" }`.

### Ready-made svg

Paths to paste into `svg`:

| Shape | Use | Style |
|---|---|---|
| Petal | narrow petal or flame | `"width": 16, "length": 1.5` |
| Star | five-pointed star, not elongated: for `major` or `scatter` only | `"width": 14..34` |

Petal:
`"M12 2C15.5 7 15.5 14 12 22C8.5 14 8.5 7 12 2Z"`

Star:
`"M12 2L14.35 8.76 21.51 8.91 15.8 13.24 17.88 20.09 12 16 6.12 20.09 8.2 13.24 2.49 8.91 9.65 8.76Z"`

## Example

```json
{
  "name": "Forest night",
  "colors": {
    "background": ["#2f4743", "#22352f"],
    "accent": "#9cc97a",
    "dim": "#4f6b5f"
  },
  "ticks": {
    "styles": {
      "stem": { "shape": "capsule", "width": 12, "length": 1.1 },
      "stemDim": { "shape": "capsule", "width": 5 },
      "leaf": { "icon": "leaf", "width": 26, "length": 1.4 },
      "leafDim": { "icon": "leaf", "iconStyle": "outline", "width": 18, "length": 1.2 }
    },
    "filled": ["stem"],
    "empty": ["stemDim"],
    "major": { "filled": "leaf", "empty": "leafDim" },
    "layout": "ring"
  }
}
```

## Rules for writing a vibe

- Output a single valid JSON object: no comments, no trailing commas.
- The schema above uses `//` comments and `a | b` only to describe types; they are not part of the JSON.
- Colors are hex strings like `"#9cc97a"`.
- Keep every number inside its range.
- Tick style names used in `filled`, `empty`, `major` and `marker` must be keys of `ticks.styles`.
- Unknown keys are rejected. Fields you don't need can be left out.
- Put the playlist link in `playlist` only if you have a real one; never invent a link.
- Empty ticks must stay visible but weaker than the accent; digits must contrast with the background.
- Ticks are elongated first of all: clearly longer than wide, like clock marks (`line`, `capsule`,
  `wedge`, `pixel`, a figured shape or a tall narrow svg). Round or square silhouettes only on every 5th minute.
- For ticks, built-in icons only in styles used by `major` (every 5th minute), never in
  `filled`, `empty` or `marker`. They are also allowed in `backdrop`.
- Not sure which tick shape fits the idea? Ask the user before writing the vibe, offering 2–3
  concrete options; don't guess.
- Widths above ~24 overlap on a 25-tick ring unless used on every fifth minute only.
- Add glow, notch, shadow, gradient, backdrop or randomness only when they serve the idea.
- For neon tubes, use `line` or `capsule` with a light `core`, `glow` and `glowStrength`.
  Empty tubes can use the same shape without a core or glow.
- On a light background a tick `gradient` goes from light to dark: put the lightest color first.
- A `backdrop` is optional: add one only when a picture under the digits suits the idea. Use a
  figured shape when one fits, otherwise an icon or your own svg (outlined or filled, see
  [backdrop](#backdrop)), in a translucent color.
- Follow the user's choices literally. Ticks all the same: exactly one style in `filled` and one
  in `empty` (the same shape, may be thinner or outlined), no `random.order`, no `scatter`.
  Varied ticks: 2–3 styles in `filled` mixed with `"random": { "order": true }`.
- Every 5th minute stands out only if asked: then a bolder `major` style (the only place for a
  built-in tick icon); otherwise no `major`.
- Talk to the user in their language (the one they write to you in), even though this document is
  in English; only the JSON keys and values stay as the format requires.
- To move the vibe into the app: copy the JSON, open [Open Paslen]({{ '/vibes/open/' | absolute_url }}) (it opens the paste screen in Paslen) and tap **Paste**. Don't put the JSON into the link: it doesn't fit a URL.
