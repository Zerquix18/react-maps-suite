import * as React from 'react';
import { useMap } from '../../hooks';

import GoogleMarkerCluster from '../../providers/GoogleMap/MarkerCluster';
import MapBoxMarkerCluster from '../../providers/MapBox/MarkerCluster';
import LeafletMarkerCluster from '../../providers/Leaflet/MarkerCluster';

interface MarkerClusterProps {
  children: React.ReactNode;
}

function MarkerCluster(props: MarkerClusterProps) {
  const { type } = useMap();

  if (type === 'google') {
    return <GoogleMarkerCluster {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxMarkerCluster {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletMarkerCluster {...props} />;
  }

  return null;
};

export default MarkerCluster;
