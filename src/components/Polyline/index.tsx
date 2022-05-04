import * as React from 'react';

import { useMap } from '../../hooks';
import { MapPolyline } from '../../models';

import GooglePolyline from '../../providers/GoogleMap/Polyline';
import MapBoxPolyline from '../../providers/MapBox/Polyline';
import LeafletPolyline from '../../providers/Leaflet/Polyline';

function Polyline(props: MapPolyline) {
  const { type } = useMap();

  if (type === 'google') {
    return <GooglePolyline {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxPolyline {...props} />;
  }
  
  if (type === 'leaflet') {
    return <LeafletPolyline {...props} />;
  }

  return null;
};

export default Polyline;
