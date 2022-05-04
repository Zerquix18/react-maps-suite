---
sidebar_position: 4
---

# Marker Cluster
**Not supported in MapBox**

A Marker Cluster allows you to group markers that are close together.

```tsx
import Maps from 'react-maps-suite';

function App() {
  return (
    <Maps provider="google" height={400}>
      <Maps.MarkerCluster>
        <Maps.Marker
          draggable
          imageUrl="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png"
          position={{lat: 19.025602371836, lng: -43.431759282209015}}
          size={{ width: 25, height: 25 }}
        />
        <Maps.Marker
          draggable
          imageUrl="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png"
          position={{lat: 19.025602371836, lng: -43.431759282209015}}
          size={{ width: 25, height: 25 }}
        />
        <Maps.Marker
          draggable
          imageUrl="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png"
          position={{lat: 19.025602371836, lng: -43.431759282209015}}
          size={{ width: 25, height: 25 }}
        />
      </Maps.MarkerCluster>
    </Maps>
  );
}
```
