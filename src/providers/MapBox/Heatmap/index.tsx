import { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';

import { useMap } from '../../../hooks';
import { MapHeatmap } from '../../../models';

// Unused props: gradient

function Heatmap(props: MapHeatmap) {
  const { path, maxIntensity, radius, opacity } = props;
  const { mapBox } = useMap();

  const [id, setId] = useState('');
  const defaultPropsRef = useRef({ path, maxIntensity });

  useEffect(() => {
    if (! mapBox) {
      return;
    }

    const id = uniqid();
    const { path, maxIntensity } = defaultPropsRef.current;

    const weights = path.map(item => item.weight || 0);
    const max = typeof maxIntensity === 'undefined' ? Math.max(...weights) : maxIntensity;
    const min = Math.min(...weights);

    mapBox.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: path.map(item => {
          const weight = ((item.weight || 0) - min) / (max - min);
          return {
            type: 'Feature',
            properties: { weight },
            geometry: {
              type: 'Point',
              coordinates: [item.lng, item.lat],
            }
          }
        })
      }
    });
  
    mapBox.addLayer({
      id,
      type: 'heatmap',
      source: id,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'], // increase based on weight
          0,
          0,
          0.1,
          0.1,
          0.2,
          0.2,
          0.3,
          0.3,
          0.4,
          0.4,
          0.5,
          0.5,
          0.6,
          0.6,
          0.7,
          0.7,
          0.8,
          0.8,
          0.9,
          0.9,
          1,
          1,
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.5,
          15,
          1.5,
          22,
          2
        ]
      }
    });

    setId(id);

    return () => {
      mapBox.removeLayer(id);
      mapBox.removeSource(id);
    };
  }, [mapBox]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    const source = mapBox.getSource(id);
    if (source.type !== 'geojson') {
      return;
    }

    const weights = path.map(item => item.weight || 0);
    const max = typeof maxIntensity === 'undefined' ? Math.max(...weights) : maxIntensity;
    const min = Math.min(...weights);

    source.setData({
      type: 'FeatureCollection',
      features: path.map(item => {
        const weight = ((item.weight || 0) - min) / (max - min);
        return {
          type: 'Feature',
          properties: { weight },
          geometry: {
            type: 'Point',
            coordinates: [item.lng, item.lat],
          }
        }
      })
    });
  }, [mapBox, id, path, maxIntensity]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'heatmap-radius', radius);
  }, [mapBox, id, radius]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'heatmap-opacity', opacity);
  }, [mapBox, id, opacity]);

  return null;
};

export default Heatmap;
