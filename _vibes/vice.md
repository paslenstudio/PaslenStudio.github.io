---
title: Vice
order: 2
image: /assets/vibes/vice.webp
description: "Neon: bright neon tube ticks from pink to orange and a palm silhouette under the digits."
---

```json
{
  "name": "Vice",
  "colors": {
    "background": ["#1C1534", "#311C46"],
    "accent": "#F04A99",
    "dim": "#4A3870",
    "marker": "#54DEE1",
    "markerFill": "#211639",
    "shadow": "#54DEE1"
  },
  "digits": { "shadowOffset": [3, 3] },
  "ticks": {
    "styles": {
      "tube": { "shape": "capsule", "width": 6, "length": 1.3, "glow": 18, "glowStrength": 2.4, "core": 0.45 },
      "glass": { "shape": "capsule", "width": 4, "length": 1.2 },
      "frame": { "shape": "capsule", "width": 16, "length": 1.3, "glow": 14, "glowStrength": 2 }
    },
    "filled": ["tube"],
    "empty": ["glass"],
    "marker": "frame",
    "gradient": ["#F04D91", "#F7A50B"]
  },
  "backdrop": { "shape": "palm-tree", "size": 0.78, "offset": [0, 0.02], "color": "#4054DEE1" }
}
```
