import * as mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';

import { useMap } from '../../../hooks';
import { MapPolygon } from '../../../models';

// Unused props: zIndex, draggable, editable, onEdited

function Polygon(props: MapPolygon) {
  const { path, fillColor, fillOpacity, strokeColor, strokeWeight, strokeOpacity, onClick, onRightClick } = props;
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
      id: `${id}-fill`,
      type: 'fill',
      source: id,
    });
        
    mapBox.addLayer({
      id: `${id}-line`,
      type: 'line',
      source: id,
    });

    setId(id);

    return () => {
      if (! mapBox.isStyleLoaded()) {
        return;
      }

      mapBox.removeLayer(`${id}-line`);
      mapBox.removeLayer(`${id}-fill`);
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
  }, [mapBox, path, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(`${id}-fill`, 'fill-color', fillColor);
  }, [mapBox, fillColor, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(`${id}-fill`, 'fill-opacity', fillOpacity);
  }, [mapBox, fillOpacity, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(`${id}-line`, 'line-color', strokeColor);
  }, [mapBox, strokeColor, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(`${id}-line`, 'line-width', strokeWeight);
  }, [mapBox, strokeWeight, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(`${id}-line`, 'line-opacity', strokeOpacity);
  }, [mapBox, strokeOpacity, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.on('click', `${id}-line`, onClickListener);
    mapBox.on('click', `${id}-fill`, onClickListener);

    return () => {
      mapBox.off('click', `${id}-line`, onClickListener);
      mapBox.off('click', `${id}-fill`, onClickListener);
    }
  }, [mapBox, id, onClickListener]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.on('contextmenu', `${id}-line`, onRightClickListener);
    mapBox.on('contextmenu', `${id}-fill`, onRightClickListener);

    return () => {
      mapBox.off('contextmenu', `${id}-line`, onRightClickListener);
      mapBox.off('contextmenu', `${id}-fill`, onRightClickListener);
    }
  }, [mapBox, id, onRightClickListener]);
  
  return null;
};

export default Polygon;
