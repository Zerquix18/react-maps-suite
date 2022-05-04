---
sidebar_position: 1
---

# Getting Started

React Maps Suite is a wrapper for various popular mapping libraries, such as Google Maps, MapBox and Leaflet, which allows you to display beautiful maps without worrying about the underlying mapping library, using the same API so you can switch to another by changing a single propery from the base map.

The main aim of React Maps Suite is to cover all your mapping needs for your React application. It is built with TypeScript and includes hooks that allow you to extend its functionality by directly accessing the map under the hood. It allows you to display markers, shapes, controls and more. There are utility functions that allow you to calculate distances, bearing, grow/rotate shapes, and more.

## Installation

You can install React Maps Suite with by running:

```npm install react-maps-suite```

React Maps Suite does not install the underlying maps API but rather loads them during runtime. This reduces the size of the library and allows you to specify a version during runtime.

Before rendering the map on your app, you need to choose a provider.

## Choosing a Provider

A provider is the underlying library that will render the map. Each library is a different. React Maps Suite provides you with components to render a specific thing (e.g a Marker) and then deals with the implementation for each provider. However, each provider may render a slightly different thing, or at a slight different size. Some of them have features that others don't support and which will be documented here.

### Google Maps

React Maps Suite uses the [Google Maps SDK for JavaScript](https://developers.google.com/maps/documentation/javascript/overview) to render a map from Google. It doesn't necessarily require an API, but if you don't include one, your map will display a "Development only" warning.

You can easily render a map using google maps with:

```jsx
import MapBase from 'react-maps-suite';

function App() {
  return <MapBase provider="google" height={400} />
}
```

For Google Maps exclusively, there are two props:

* `googleLoaderOptions` which allows you to specify the `apiKey`, `version` and `libraries` when loading the Maps SDK.
* `googleOptions` which is directly passed to the Maps SDK's constructor.

A more typical usage would be:

```jsx
import Maps from 'react-maps-suite';

function App() {
  return <Maps provider="google" height={400} googleLoaderOptions={{ apiKey: 'YOUR API KEY', libraries: ['geometry']}} />
}
```

You can read more about the base map here.

### MapBox

React Maps Suite uses [MapBox's GL library](https://docs.mapbox.com/mapbox-gl-js/guides/) to render a MapBox map. It **requires** an [Access Token](https://account.mapbox.com/). There are two props exclusively for MapBox:

* `mapBoxLoaderOptions` which allows you to specify the `version`. **Default is 2.8.1**.
* `mapBoxOptions` which is directly passed to the MapBox GL's constructor. This is where `apiKey` goes.


A typical example would be:


```jsx
import Maps from 'react-maps-suite';

function App() {
  return <Maps provider="mapbox" height={400} mapBoxOptions={{ accessToken: 'YOUR ACCESS TOKEN' }} />
}
```

### Leaflet

[Leaflet's Javascript library](https://leafletjs.com/) is used for the Leaflet implementation. It does not require an access token or API key, but you need to provide your own tile layers to render anything. Open Street Maps provides free tiles you can use. You can read [their terms in their copyright page](https://www.openstreetmap.org/copyright).

An example would be:

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

## Contributing

You can contribute on Github or you can buy me a coffee.

## Beyond

You are now ready to add more components to your map. They are passed a children of the main map.

