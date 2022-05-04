import { useEffect, useRef } from 'react';
import { useMap } from '../../../hooks';

interface LayerProps {
  url: string;
  options: L.TileLayerOptions;
}

function Layer({ url, options }: LayerProps) {
  const { leaflet } = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    layerRef.current = window.L.tileLayer(url, options);
    layerRef.current.addTo(leaflet);

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
      }
    };
  }, [leaflet, url, options]);

  return null;
};

export default Layer;
