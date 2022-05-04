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

<iframe src="https://codesandbox.io/embed/patient-dew-y10tmm?fontsize=14&hidenavigation=1&theme=dark"
     style={{width: '100%', height: '500px', border:0, borderRadius: '4px', overflow: 'hidden'}}     title="patient-dew-y10tmm"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

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
