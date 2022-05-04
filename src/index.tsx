import * as React from 'react';
import { MapComponentProps } from './models';

// base map
import GoogleMap from './providers/GoogleMap';
import MapBox from './providers/MapBox';
import Leaflet from './providers/Leaflet';

// sub-components, supported on all providers
import Control from './components/Control';
import Circle from './components/Circle';
import Heatmap from './components/Heatmap';
import Marker from './components/Marker';
import MarkerCluster from './components/MarkerCluster';
import Popup from './components/Popup';
import Polygon from './components/Polygon';
import Polyline from './components/Polyline';
import Rectangle from './components/Rectangle';

// leaflet-only
import LeafletLayer from './providers/Leaflet/Layer';
import LeafletOfflineLayer from './providers/Leaflet/OfflineLayer';

function Maps(props: MapComponentProps) {
  switch (props.provider) {
    case 'google':
      return <GoogleMap {...props} />
    case 'mapbox':
      return <MapBox {...props} />;
    case 'leaflet':
      return <Leaflet {...props} />
    default:
      throw new Error('Unsupported provider.');
  }
}

Maps.Circle = Circle;
Maps.Control = Control;
Maps.Heatmap = Heatmap;
Maps.Marker = Marker;
Maps.MarkerCluster = MarkerCluster;
Maps.Popup = Popup;
Maps.Polygon = Polygon;
Maps.Polyline = Polyline;
Maps.LeafletLayer = LeafletLayer;
Maps.LeafletOfflineLayer = LeafletOfflineLayer;
Maps.Rectangle = Rectangle;

export * from './models';
export * from './hooks';
export * from './utils';

export default Maps;
