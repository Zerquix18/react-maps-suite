import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type L from 'leaflet';

import { useMap } from '../../../hooks';
import { MapMarkerClusterProvider } from '../../../context';

interface MarkerClusterProps {
  children: React.ReactNode;
}

function MarkerCluster({ children }: MarkerClusterProps) {
  const { leaflet } = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const [, setLoaded] = useState(false);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    clusterRef.current = new window.L.MarkerClusterGroup({
      showCoverageOnHover: false,
    });
    clusterRef.current.addTo(leaflet);

    setLoaded(true); // triggers a re-render now that we have the ref.

    return () => {
      if (clusterRef.current) {
        clusterRef.current.remove();
      }
    };
  }, [leaflet]);

  if (clusterRef.current === null) {
    return null;
  }

  return (
    <MapMarkerClusterProvider leafletCluster={clusterRef.current}>
      { children }
    </MapMarkerClusterProvider>
  );
};

export default MarkerCluster;
