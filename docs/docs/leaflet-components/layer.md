---
sidebar_position: 2
---

# LeafletLayer

The LeafletLayer component renders a layer for a leaflet map. It is ignored with the other providers, but required when using Leaflet to specify the tile provider.

```jsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="leaflet" height={400}>
      <Maps.LeafletLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        options={{attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}}
      />
    </Maps>
  )
}
```

## Props

### url
The URL for the tile provider.

### options
The options for Leaflet. [See the documentation](https://leafletjs.com/reference.html#tilelayer-option).
