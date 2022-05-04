import * as React from 'react';

import { useMap } from '../../hooks';
import { MapPolygon } from '../../models';

import GooglePolygon from '../../providers/GoogleMap/Polygon';
import MapBoxPolygon from '../../providers/MapBox/Polygon';
import LeafletPolygon from '../../providers/Leaflet/Polygon';

function Polygon(props: MapPolygon) {
  const { type } = useMap();

  if (type === 'google') {
    return <GooglePolygon {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxPolygon {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletPolygon {...props} />;
  }

  return null;
};

export default Polygon;
