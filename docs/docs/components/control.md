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

<iframe src="https://codesandbox.io/embed/weathered-field-ez72b2?fontsize=14&hidenavigation=1&theme=dark"
     style={{width: '100%', height: '500px', border:0, borderRadius: '4px', overflow: 'hidden'}}
     title="weathered-field-ez72b2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

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

If you pass a position which is not supported by the provider, it will be ignored and nothing will be rendered. 

### children

The component to render on the map.
