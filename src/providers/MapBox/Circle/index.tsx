import { useCallback, useEffect, useState } from 'react';
import uniqid from 'uniqid';

import { useMap } from '../../../hooks';
import { MapCircle } from '../../../models';

// unsupported props: zIndex, editable, draggable, onEdited, onDragEnd

function Circle(props: MapCircle) {
  const { mapBox } = useMap();
  const [id, setId] = useState('');

  const { position, radius, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, onClick, onRightClick } = props;

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

    const id = uniqid();

    mapBox.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.lng, position.lat],
        },
        properties: {}
      },
    });

    mapBox.addLayer({
      id,
      type: 'circle',
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

    // https://stackoverflow.com/a/37794326 

    const value = {
      stops: [
        [0, 0],
        [20, radius / 0.075 / Math.cos(position.lat * Math.PI / 180)]
      ],
      base: 2
    };

    mapBox.setPaintProperty(id, 'circle-radius', value);
  }, [mapBox, id, position.lat, radius]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'circle-color', fillColor);
  }, [mapBox, fillColor, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'circle-opacity', fillOpacity);
  }, [mapBox, fillOpacity, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'circle-stroke-color', strokeColor);
  }, [mapBox, strokeColor, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'circle-stroke-opacity', strokeOpacity);
  }, [mapBox, strokeOpacity, id]);

  useEffect(() => {
    if (! mapBox || ! id) {
      return;
    }

    mapBox.setPaintProperty(id, 'circle-stroke-width', strokeWeight);
  }, [mapBox, strokeWeight, id]);

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
}

export default Circle;
