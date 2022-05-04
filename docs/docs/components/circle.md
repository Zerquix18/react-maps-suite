---
sidebar_position: 5
---

# Circle

The Circle component renders a circle at a given location, with a given radius.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Circle
        radius={200000}
        fillColor="#ff0000"
        position={{ lat: 18.5578564, lng: -68.3926941 }}
        fillOpacity={1}
      />
    </Maps>
  );
}
```

## Props

### radius *
The radius for the circle in meters.

### position *
A `lat` and `lng` object to render the circle.

### fillColor *
The color to fill the circle in hexadecimal (e.g `#ff0000`).

### fillOpacity
The opacity for the circle from 0 to 1.

### strokeColor
The color for the border of the circle in hexadecimal (e.g `#000000`).

### strokeOpacity
The opacity for the border from 0 to 1.

### strokeWeight
The size of the border in pixels.

### zIndex
**Unsupported by Leaflet, MapBox**.
A zIndex value for the circle element.

### editable
**Unsupported by Leaflet, MapBox**.
Whether the circle is editable or not.

### draggable
**Unsupported by Leaflet, MapBox**.
Whether the circle is editable or not.

### onClick
A function that is called when the circle is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the circle is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onEdited
**Unsupported by Leaflet, MapBox**.

A function that is called when the circle is edited. The parameter is an event object containing a `radius`.

### onDragEnd
**Unsupported by Leaflet, MapBox**.
A function that is called when the circle is dropped. The parameter is an event object containing a `position` with a `lat` and `lng`.
