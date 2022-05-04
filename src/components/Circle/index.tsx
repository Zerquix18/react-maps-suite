import * as React from 'react';

import { useMap } from '../../hooks';
import { MapCircle } from '../../models';

import GoogleCircle from '../../providers/GoogleMap/Circle';
import MapBoxCircle from '../../providers/MapBox/Circle';
import LeafletCircle from '../../providers/Leaflet/Circle';

function Polyline(props: MapCircle) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleCircle {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxCircle {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletCircle {...props} />;
  }

  return null;
};

export default Polyline;
