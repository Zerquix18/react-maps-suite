---
sidebar_position: 2
---

# Control

The Control component shows up in one of the corners of the map. This is supported by all providers, but not all of them support the same positions. Check the prop list to see available places.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Control position="TOP_RIGHT">
        <div style={{ backgroundColor: 'white' }}>
          A white box in the top right.
        </div>
      </Maps.Control>
    </Maps>
  );
}
```

## Props

### position

Google supports:

* TOP_CENTER
* TOP_LEFT
* TOP_RIGHT
* RIGHT_TOP
* LEFT_CENTER
* LEFT_TOP
* RIGHT_CENTER
* LEFT_BOTTOM
* RIGHT_BOTTOM
* BOTTOM_CENTER
* BOTTOM_LEFT
* BOTTOM_RIGHT

MapBox supports:

* TOP_LEFT
* TOP_RIGHT
* BOTTOM_LEFT
* BOTTOM_RIGHT

Leaflet supports:

* TOP_LEFT
* TOP_RIGHT
* BOTTOM_LEFT
* BOTTOM_RIGHT

### children

The component to render on the map.
