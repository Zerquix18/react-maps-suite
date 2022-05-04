import * as React from 'react';
import { useMap } from '../../hooks';
import { MapMarker } from '../../models';

import GoogleMarker from '../../providers/GoogleMap/Marker';
import MapBoxMarker from '../../providers/MapBox/Marker';
import LeafletMarker from '../../providers/Leaflet/Marker';

function Marker(props: MapMarker) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleMarker {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxMarker {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletMarker {...props} />;
  }

  return null;
};

export default Marker;
