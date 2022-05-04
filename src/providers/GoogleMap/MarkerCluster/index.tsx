import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { useMap } from '../../../hooks';
import { MapMarkerClusterProvider } from '../../../context';

interface MarkerClusterComponentProps {
  children: React.ReactNode;
}

function MarkerClusterComponent({ children }: MarkerClusterComponentProps) {
  const { googleMap } = useMap();
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const [, setLoaded] = useState(false);

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    clusterRef.current = new MarkerClusterer({ map: googleMap });
    clusterRef.current.setMap(googleMap);

    setLoaded(true); // triggers a re-render now that we have the ref.

    return () => {
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  if (clusterRef.current === null) {
    return null;
  }

  return (
    <MapMarkerClusterProvider googleCluster={clusterRef.current}>
      { children }
    </MapMarkerClusterProvider>
  );
};

export default MarkerClusterComponent;
