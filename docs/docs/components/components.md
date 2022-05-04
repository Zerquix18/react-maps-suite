---
sidebar_position: 1
---

# Components

React Maps Suite has a base component (the default export) which creates the map instance and exposes the Context API provider. This is then used by other components, which are passed as children, to render things on the map such as markers or shapes. The map instance and its utils functions can be accessed through the [hooks](hooks).

## Base component

The base component renders a map given the provider. There are 3 supported providers: `google`, `mapbox` and `leaflet`. Each provider will have a different method to set it up. You can see how to render a basic component in the [intro guide](../intro).

The base component has the following props:

### provider *
A string with `google`, `mapbox` or `leaflet`.

### defaultCenter
An object with `lat` and `lng`.

### defaultZoom
The default zoom. Will vary depending on the provider.

### center
An object with `lat` and `lng`.

### zoom
The current zoom. Will vary depending on the provider.

### height
The height for the div that contains the map.

### minZoom
The minimum zoom the map will allow.

### maxZoom
The maximum zoom the map will allow.

### maxBounds
The maximum bounds the map will allow.

### loadingComponent
A component to display while the map is being loaded.

### googleLoaderOptions
A `LoaderOptions` object for the `@googlemaps/js-api-loader`. Typically you want to include the `apiKey`, an array `libraries` to load and the `version` to load.

### googleOptions
Options to pass directly to the `google.maps.Map` instance.

### mapBoxLoaderOptions
Options to load mapbox. This should include the version, otherwise the version `2.7.0` will be loaded.

### mapBoxOptions
Options to pass directly to the `mapboxgl.Map` instance.

### leafletLoaderOptions
Options to load Leaflet. This should include the version, otherwise the version `latest` will be loaded.

### leafletOptions
Options to pass directly to the `L.Map` object.

### onClick
A function that is called when the map is clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onRightClick
A function that is called when the map is right-clicked. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onZoomChange
A function that is called when the map zoom changes. The parameter is an event object containing a `zoom` key.

### onCenterChange
A function that is called when the map center changes. The parameter is an event object containing a `position` with a `lat` and `lng`.

### onMapLoad
A function that is called when the map is loaded.

## Creating a custom component

You can create a custom component using the `useMap` hook. The `useMap` provider gives you three objects: `googleMap`, `leaflet`, `mapBox` which include the map instance. You can use `useEffect` to add something to the map and then clean it up in the end.

The Maps.Control component illustrates this:

```jsx
function Control({ position, children }: MapControl) {
  const { googleMap } = useMap();
  const divRef = useRef(document.createElement('div'));

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    const googleMapPosition = google.maps.ControlPosition[position];
    const index = googleMap.controls[googleMapPosition].push(divRef.current);

    return () => {
      if (googleMap.controls[googleMapPosition].getAt(index)) {
        googleMap.controls[googleMapPosition].removeAt(index);
      }
    };
  }, [googleMap, position]);

  return createPortal(children, divRef.current);
}
```

This component has to be places **inside** the default export.

This allows you to:
* Add any feature you want, regardless of whether this library supports it or not.
* Add features for a particular map provider, and be able to switch to others without causing side-effects.
* Clean things up in the end.
