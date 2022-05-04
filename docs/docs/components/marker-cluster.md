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

<iframe src="https://codesandbox.io/embed/rough-wind-cks609?fontsize=14&hidenavigation=1&theme=dark"
     style={{width: '100%', height: '500px', border:0, borderRadius: '4px', overflow: 'hidden'}}     title="rough-wind-cks609"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>