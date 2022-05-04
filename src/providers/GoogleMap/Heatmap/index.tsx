import { useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapHeatmap } from '../../../models';

function Heatmap(props: MapHeatmap) {
  const { googleMap } = useMap();
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  
  const { path, gradient, dissipating, maxIntensity, radius, opacity } = props;

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    heatmapRef.current = new google.maps.visualization.HeatmapLayer();
    heatmapRef.current.setMap(googleMap);

    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }

    const data = new google.maps.MVCArray<google.maps.visualization.WeightedLocation | google.maps.LatLng>();

    path.forEach(point => {
      const { weight } = point;
      const location = new google.maps.LatLng(point.lat, point.lng);

      if (typeof weight === 'undefined') {
        data.push(location);
        return;
      }

      data.push({ location, weight });
    });

    heatmapRef.current.setData(data);
  }, [path]);

  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }
    heatmapRef.current.set('gradient', gradient);
  }, [gradient]);
  
  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }
    heatmapRef.current.set('dissipating', dissipating);
  }, [dissipating]);

  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }
    heatmapRef.current.set('maxIntensity', maxIntensity);
  }, [maxIntensity]);

  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }
    heatmapRef.current.set('radius', radius);
  }, [radius]);

  useEffect(() => {
    if (! heatmapRef.current) {
      return;
    }
    heatmapRef.current.set('opacity', opacity);
  }, [opacity]);

  return null;
};

export default Heatmap;
