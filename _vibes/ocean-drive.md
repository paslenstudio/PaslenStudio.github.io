---
title: Ocean Drive
order: 3
image: /assets/vibes/ocean-drive.webp
description: Sunny Miami morning — pistol rounds from orange to purple, empty ones as outlines, and a palm silhouette under the digits, on peach-to-aqua.
---

```json
{
  "name": "Ocean Drive",
  "colors": {
    "background": ["#FFF1E6", "#D9F3EF"],
    "accent": "#E23A7E",
    "dim": "#D69BB1",
    "marker": "#139FA6",
    "markerFill": "#FFF1E6",
    "notch": "#FFF1E6",
    "shadow": "#63D2D3"
  },
  "digits": { "shadowOffset": [3, 3] },
  "ticks": {
    "styles": {
      "round": { "shape": "pistol-round", "width": 13, "length": 0.95, "glow": 4 },
      "shell": { "shape": "pistol-round", "stroke": 1.5, "width": 12, "length": 0.9 },
      "frame": { "shape": "capsule", "width": 20, "glow": 4 }
    },
    "filled": ["round"],
    "empty": ["shell"],
    "marker": "frame",
    "gradient": ["#F7A50B", "#E23A7E", "#A93BA8"]
  },
  "backdrop": { "shape": "palm-tree", "size": 0.78, "offset": [0, 0.02], "color": "#59139FA6" }
}
```
