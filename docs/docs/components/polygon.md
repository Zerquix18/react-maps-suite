---
sidebar_position: 6
---

# Polygon

The Polygon component renders a polygon with a set of coordinates.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Polygon
        path={[
          {lat: 10.517041542637703, lng: -99.15441553220901},
          {lat: -2.9572396966975063, lng: -99.68175928220901},
          {lat: 4.770300732061375, lng: -86.32238428220901}
          {lat: 10.517041542637703, lng: -99.15441553220901},
        ]}
        fillColor="#ff0000"
        strokeColor="#000000"
        strokeWeight={10}
      />
    </Maps>
  );
}
```

## Props

### path *
A list of { lat, lng } to display the polygon.

### fillColor *
The color to fill the polygon in hexadecimal (e.g `#ff0000`).

### strokeColor *
The color for the border of the polygon in hexadecimal (e.g `#000000`).
### fillOpacity
The opacity for the polygon from 0 to 1.

### strokeOpacity
The opacity for the border from 0 to 1.

### strokeWeight
The size of the border in pixels.

### zIndex
**Unsupported by Leaflet, MapBox**.
A zIndex value for the polygon element.

### editable
**Unsupported by Leaflet, MapBox**.
Whether the polygon is editable or not.

### draggable
**Unsupported by Leaflet, MapBox**.
Whether the polygon is editable or not.

### onClick
A function that is called when the polygon is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the polygon is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onEdited
**Unsupported by Leaflet, MapBox**.

A function that is called when the polygon is edited. The parameter is an event object containing a `path`.

### onDragEnd
**Unsupported by Leaflet, MapBox**.
A function that is called when the polygon is dropped. The parameter is an event object containing a `path`.
