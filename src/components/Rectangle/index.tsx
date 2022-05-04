import * as React from 'react';

import { useMap } from '../../hooks';
import { MapRectangle } from '../../models';

import GoogleRectangle from '../../providers/GoogleMap/Rectangle';
import MapBoxRectangle from '../../providers/MapBox/Rectangle';
import LeafletRectangle from '../../providers/Leaflet/Rectangle';

function Rectangle(props: MapRectangle) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleRectangle {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxRectangle {...props} />;
  }
  
  if (type === 'leaflet') {
    return <LeafletRectangle {...props} />;
  }

  return null;
};

export default Rectangle;
