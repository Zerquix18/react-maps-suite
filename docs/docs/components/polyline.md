---
sidebar_position: 7
---

# Polyline

The Polyline component renders a line with a set of coordinates.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Polyline
        path={[
          { lat: 45.24769592870551, lng: -101.61535303220901 },
          { lat: 44.50029675908851, lng: -58.724728032209015 }
        ]}
        strokeColor="#ff0000"
        strokeWeight={3}
      />
    </Maps>
  );
}
```

## Props

### path *
A list of { lat, lng } to display the line.

### strokeColor *
The color for the border of the polyline in hexadecimal (e.g `#000000`).

### strokeOpacity
The opacity for the border from 0 to 1.

### strokeWeight
The size of the border in pixels.

### zIndex
**Unsupported by Leaflet, MapBox**.
A zIndex value for the polyline element.

### editable
**Unsupported by Leaflet, MapBox**.
Whether the polyline is editable or not.

### draggable
**Unsupported by Leaflet, MapBox**.
Whether the polyline is editable or not.

### onClick
A function that is called when the polyline is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the polyline is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onEdited
**Unsupported by Leaflet, MapBox**.

A function that is called when the polyline is edited. The parameter is an event object containing:
- `path`: The new full path.
- `position`: The position that was added or edited.
- `vertex`: The indexwhere `position` was updated.
- `edge`: The index where `position was added.

### onDragEnd
**Unsupported by Leaflet, MapBox**.
A function that is called when the polyline is dropped. The parameter is an event object containing a `path`.
