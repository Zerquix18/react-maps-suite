---
sidebar_position: 3
---

# Marker

The Marker component renders a marker on a given position.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.Marker
        imageUrl="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png"
        position={{lat: 19.025602371836, lng: -43.431759282209015}}
        size={{ width: 25, height: 25 }}
      />
    </Maps>
  );
}
```

## Props

### position *
An object with the `lat` and `lng` to render the image.

### imageUrl
**Required by MapBox, Leaflet**
The URL of the image to render.

### label
**Not supported by MapBox**

The label to display along with the marker.

### size
An object with the `width` and `height` for the image.

### anchor
**Not supported by MapBox**
An object with the `x` and `y` for the image.

### angle
**Not supported by Google**

An angle in degrees between -180 and 180 to rotate the image. 

### zIndex
A zIndex value for the marker element.

### draggable
Whether the marker will be draggable or not.

### onDrag
A function that is called while the marker is being dragged. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onDragEnd
A function that is called when the marker is dropped. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onClick
A function that is called when the marker is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the marker is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.
