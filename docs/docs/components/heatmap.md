---
sidebar_position: 9
---

# Heatmap

The heatmap component renders a heatmap on the map.

```tsx
import Maps from 'react-maps-suite';

function App() {
  const heatMapData = [
    { lat: 37.782, lng: -122.447, weight: 0.5 },
    { lat: 37.782, lng: -122.445 },
    { lat: 37.782, lng: -122.443, weight: 2 },
    { lat: 37.782, lng: -122.441, weight: 3 },
    { lat: 37.782, lng: -122.439, weight: 2 },
    { lat: 37.782, lng: -122.437 },
    { lat: 37.782, lng: -122.435, weight: 0.5 },
    { lat: 37.785, lng: -122.447, weight: 3 },
    { lat: 37.785, lng: -122.445, weight: 2 },
    { lat: 37.785, lng: -122.443 },
    { lat: 37.785, lng: -122.441, weight: 0.5 },
    { lat: 37.785, lng: -122.439 },
    { lat: 37.785, lng: -122.437, weight: 2 },
    { lat: 37.785, lng: -122.435, weight: 3}
  ]

  return (
    <Maps
      provider="google"
      height={400}
      googleLoaderOptions={{ apiKey: '', libraries: ['visualization' ]}}
      onClick={({ position }) => console.log(position)}>
      <Maps.Heatmap path={heatMapData} />
    </Maps>
  );
}
```

For Google, the library "visualization" has to be loaded using the googleLoaderOptions.

<iframe src="https://codesandbox.io/embed/pedantic-hertz-9j0b9r?fontsize=14&hidenavigation=1&theme=dark"
     style={{width: '100%', height: '500px', border:0, borderRadius: '4px', overflow: 'hidden'}}     title="pedantic-hertz-9j0b9r"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Props

### path *
An array of objects including `lat`, `lng` and an optional `weight`.

### gradient

The color gradient of the heatmap, specified as an array of CSS color strings

### dissipating

Specifies whether heatmaps dissipate on zoom. When dissipating is false the radius of influence increases with zoom level to ensure that the color intensity is preserved at any given geographic location

### maxIntensity
The maximum intensity of the heatmap. By default, heatmap colors are dynamically scaled according to the greatest concentration of points at any particular pixel on the map. This property allows you to specify a fixed maximum. Setting the maximum intensity can be helpful when your dataset contains a few outliers with an unusually high intensity.

### radius
The radius of influence for each data point, in pixels.

### opacity

The opacity of the heatmap, expressed as a number between 0 and 1.
