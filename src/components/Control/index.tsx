import * as React from 'react';

import { useMap } from '../../hooks';
import { MapControl } from '../../models';

import GoogleControl from '../../providers/GoogleMap/Control';
import MapBoxControl from '../../providers/MapBox/Control';
import LeafletControl from '../../providers/Leaflet/Control';

function Control(props: MapControl) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleControl {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxControl {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletControl {...props} />;
  }

  return null;
};

export default Control;
