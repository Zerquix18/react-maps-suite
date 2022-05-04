---
sidebar_position: 8
---

# Rectangle

The Rectangle component renders a rectangle with a set of coordinates. 

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Rectangle
        bounds={{
          ne: {
            lat: -10.420163042657036, lng: -84.56457178220901
            },
          sw: {
            lat: -3.093767326610532,
            lng: -77.00597803220901
          }
        }}
        fillColor="#ff0000"
        strokeColor="#000000"
      />
    </Maps>
  );
}
```

## Props

### bounds *
An object containing the north east and southwest coordinates.

### fillColor *
The color to fill the rectangle in hexadecimal (e.g `#ff0000`).

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
Whether the rectangle is editable or not.

### draggable
**Unsupported by Leaflet, MapBox**.
Whether the rectangle is editable or not.

### onClick
A function that is called when the rectangle is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the rectangle is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onEdited
### onDragEnd
