import * as React from 'react';

import { useMap } from '../../hooks';
import { MapHeatmap } from '../../models';

import GoogleHeatmap from '../../providers/GoogleMap/Heatmap';
import MapBoxHeatmap from '../../providers/MapBox/Heatmap';
import LeafletHeatmap from '../../providers/Leaflet/Heatmap';

function Heatmap(props: MapHeatmap) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleHeatmap {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxHeatmap {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletHeatmap {...props} />;
  }

  return null;
};

export default Heatmap;
