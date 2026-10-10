---
title: Yellow Glyphs
order: 1
image: /assets/vibes/yellow-glyphs.webp
description: Yellow glitchy pixel ticks with a cyan shadow on near-black.
---

```json
{
  "name": "Yellow Glyphs",
  "colors": {
    "background": "#0E1114",
    "accent": "#F3EE47",
    "dim": "#3A5E6D",
    "shadow": "#49DEFB"
  },
  "digits": { "shadowOffset": [3, 3] },
  "ticks": {
    "styles": {
      "thin": { "shape": "line", "width": 3 },
      "px": { "shape": "pixel", "width": 15, "length": 1.25, "glow": 10, "shadowOffset": [4, 4] },
      "frame": { "shape": "line", "width": 24, "length": 1.4 }
    },
    "filled": ["px"],
    "empty": ["thin"],
    "marker": "frame"
  }
}
```
