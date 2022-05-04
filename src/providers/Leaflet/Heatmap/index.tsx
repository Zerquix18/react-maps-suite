import { useEffect, useRef } from 'react';
import { HeatLatLngTuple, HeatLayer } from 'leaflet';

import { useMap } from '../../../hooks';
import { MapHeatmap } from '../../../models';

function Heatmap(props: MapHeatmap) {
  const { path, gradient, maxIntensity, radius, opacity } = props;
  const { leaflet } = useMap();
  const layerRef = useRef<HeatLayer | null>(null);
  const defaults = useRef({ path, gradient, maxIntensity, radius, opacity });
  
  useEffect(() => {
    if (! leaflet) {
      return;
    }

    const { path, gradient, maxIntensity, radius, opacity: minOpacity  } = defaults.current;

    const weights = path.map(item => item.weight || 0);
    const max = typeof maxIntensity === 'undefined' ? Math.max(...weights) : maxIntensity;
    const min = Math.min(...weights);

    const latlngs: HeatLatLngTuple[] = path.map(position => {
      const { lat, lng } = position;
      const intensity = ((position.weight ?? 0) - min) / (max - min);
      return [lat, lng, intensity * 100];
    });

    layerRef.current = window.L.heatLayer(latlngs, { radius, minOpacity, gradient });
    layerRef.current.addTo(leaflet);

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
      }
    };
  }, [leaflet]);

  useEffect(() => {
    if (! layerRef.current) {
      return;
    }

    const weights = path.map(item => item.weight || 0);
    const max = typeof maxIntensity === 'undefined' ? Math.max(...weights) : maxIntensity;
    const min = Math.min(...weights);

    const latlngs: HeatLatLngTuple[] = path.map(position => {
      const { lat, lng } = position;
      const intensity = ((position.weight ?? 0) - min) / (max - min);
      return [lat, lng, intensity * 100];
    });

  layerRef.current.setLatLngs(latlngs);    
  }, [path, maxIntensity]);

  useEffect(() => {
    if (! layerRef.current) {
      return;
    }

    layerRef.current.setOptions({ gradient, radius, minOpacity: opacity })
  }, [gradient, radius, opacity]);

  return null;
};

export default Heatmap;
