import { useCallback, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import * as turf from '@turf/turf';

import { useMap } from '../../../hooks';
import { MapRectangle } from '../../../models';

// unused props: zIndex, draggable, editable, onDragEnd, onEdited

function Rectangle(props: MapRectangle) {
  const { mapBox } = useMap();

  const { bounds, fillColor, strokeColor, fillOpacity, strokeOpacity, strokeWeight, onClick, onRightClick } = props;

  const [id, setId] = useState('');
  const defaultBoundsRef = useRef(bounds);

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

    const { sw, ne } = defaultBoundsRef.current;
    const lineString = turf.lineString([[ne.lng, ne.lat], [sw.lng, sw.lat]])
    const bbox = turf.bbox(lineString);
    const polygon = turf.bboxPolygon(bbox);

    let id = uniqid();

    mapBox.addSource(id, {
      type: 'geojson',
      data: polygon
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

    const { sw, ne } = bounds;
    const lineString = turf.lineString([[ne.lng, ne.lat], [sw.lng, sw.lat]])
    const bbox = turf.bbox(lineString);
    const polygon = turf.bboxPolygon(bbox);

    source.setData(polygon);
  }, [mapBox, bounds, id]);

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

export default Rectangle;
