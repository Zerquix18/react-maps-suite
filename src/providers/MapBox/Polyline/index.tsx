import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import uniqid from 'uniqid';

import { useMap } from '../../../hooks';
import { MapPolyline } from '../../../models';

// Unused props: zIndex, draggable, editable, onEdited

function Polyline(props: MapPolyline) {
  const { path, strokeColor, strokeWeight, strokeOpacity, dashed, onClick, onRightClick } = props;
  const { mapBox } = useMap();
  const [id, setId] = useState('');
  const defaultPathRef = useRef(path);

  const onClickListener = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (! onClick) {
      return;
    }

    const { lat, lng } = e.lngLat;
    const position = { lat, lng };
    onClick({ position });
  }, [onClick]);

  const onRightClickListener = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (! onRightClick) {
      return;
    }

    const { lat, lng } = e.lngLat;
    const position = { lat, lng };
    onRightClick({ position });
  }, [onRightClick]);

  useEffect(() => {
    if (! mapBox) {
      return;
    }

    const newPath = [...defaultPathRef.current];
    newPath.push(newPath[0]);

    let id = uniqid();

    mapBox.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: newPath.map(({ lat, lng }) => [lng, lat]),
        }
      }
    });
    
    mapBox.addLayer({
      id,
      type: 'line',
      source: id,
    });

    setId(id);

    return () => {
      if (! mapBox.isStyleLoaded()) {
        return;
      }

      mapBox.removeLayer(id);
      mapBox.removeSource(id);
    };
  }, [mapBox]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    const source = mapBox.getSource(id);
    if (source.type !== 'geojson') { // lettings ts know.
      return;
    }

    const newPath = [...path];
    newPath.push(path[0]);

    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: newPath.map(({ lat, lng }) => [lng, lat]),
      }
    });
  }, [path, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'line-color', strokeColor);
  }, [mapBox, strokeColor, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'line-width', strokeWeight);
  }, [mapBox, strokeWeight, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'line-opacity', strokeOpacity);
  }, [mapBox, strokeOpacity, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'line-dasharray', dashed ? [6, 2] : []);
  }, [mapBox, dashed, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.on('click', id, onClickListener);

    return () => {
      mapBox.off('click', id, onClickListener);
    }
  }, [mapBox, id, onClickListener]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.on('contextmenu', id, onRightClickListener);

    return () => {
      mapBox.off('contextmenu', id, onRightClickListener);
    }
  }, [mapBox, id, onRightClickListener]);
  
  return null;
};

export default Polyline;
