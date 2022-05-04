---
sidebar_position: 4
---

# Hooks

React Maps Suite supports two hooks which allow you to extend the functionality of the map by directly accessing the underlying map libraries. The provider is rendered on the base `<Maps />` component or the default export.

## useMapCluster

Returns an object with `googleCluster` (a `@googlemaps/markerclusterer` object) and `leafletCluster` (a `L.MarkerClusterGroup`). This is used internally to cluster the markers.

## useMap

Includes an object with:

* `type`: The provider which is being used (google | mapbox | leaflet).
* `googleMap`: A `google.maps.Map` object, only if the `type` is google.
* `mapBox`: A `mapboxgl.Map` object, only if the `type` is mapbox.
* `leaflet`: A `L.Map` object, only if the `type` is leaflet.
* `center`: The center of the map, regardless of the provider.
* `zoom`: The zoom of the map, regardless of the provider.
* `utils`: Helper functions that you can use regardless of the provider:
* * `animateTo`: animates the map towards a particular position.
* * `animateToBounds`: animates the map towards specific bounds.
* * `fitToPath`: fits the map to a set of bounds.
* * `getElement`: returns the div that renders the map.
* * `unproject`: returns the x, y coordinates for a given lat, lng.
