import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapMarker } from '../../../models';

// Unsupported props: label, anchor

type DraggedObject = { target: mapboxgl.Marker };

function Marker(props: MapMarker) {
  const { mapBox } = useMap();
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const elementRef = useRef(document.createElement('img'));

  const { position, imageUrl, angle, size, zIndex, draggable, onClick, onRightClick, onDrag, onDragEnd } = props;
  const defaultPositionRef = useRef(position);

  const rotate = useCallback(() => {
    if (! angle) {
      return;
    }
  
    if (! elementRef.current.parentElement) {
      return;
    }
    elementRef.current.style.transform = `rotate(${angle}deg)`;
    elementRef.current.parentElement.style.overflow = 'visible';
  }, [angle]);

  const onClickListener = useCallback(() => {
    if (! markerRef.current || ! onClick) {
      return;
    }

    const { lat, lng } = markerRef.current.getLngLat();

    const position = { lat, lng };

    onClick({ position });
  }, [onClick]);

  const onRightClickListener = useCallback(() => {
    if (! markerRef.current || ! onRightClick) {
      return;
    }

    const { lat, lng } = markerRef.current.getLngLat();

    const position = { lat, lng };

    onRightClick({ position });
  }, [onRightClick]);

  const onDragListener = useCallback(({ target }: DraggedObject) => {
    if (! onDrag) {
      return;
    }

    const { lat, lng } = target.getLngLat();

    const position = { lat, lng };

    onDrag({ position });
  }, [onDrag]);

  const onDragEndListener = useCallback(({ target }: DraggedObject) => {
    if (! onDragEnd) {
      return;
    }

    const { lat, lng } = target.getLngLat();

    const position = { lat, lng };

    onDragEnd({ position });
  }, [onDragEnd]);

  useEffect(() => {
    if (! mapBox) {
      return;
    }

    markerRef.current = new window.mapboxgl.Marker({ element: elementRef.current });
    markerRef.current.setLngLat(defaultPositionRef.current);

    markerRef.current.addTo(mapBox);
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    }
  }, [mapBox]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setLngLat(position);
  }, [position]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setDraggable(!! draggable);
  }, [draggable]);

  useEffect(() => {
    if (! imageUrl) {
      return;
    }

    elementRef.current.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (! zIndex) {
      return;
    }

    elementRef.current.style.zIndex = String(zIndex);
  }, [zIndex]);

  useEffect(() => {
    if (! size) {
      return;
    }

    elementRef.current.width = size.width;
    elementRef.current.height = size.height;
  }, [size]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    rotate();
  }, [rotate]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.getElement().addEventListener('click', onClickListener);
    return () => {
      if (markerRef.current && markerRef.current.getElement()) {
        markerRef.current.getElement().removeEventListener('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.getElement().addEventListener('contextmenu', onRightClickListener);
    return () => {
      if (markerRef.current && markerRef.current.getElement()) {
        markerRef.current.getElement().removeEventListener('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.on('drag', onDragListener);
    return () => {
      if (markerRef.current) {
        markerRef.current.off('drag', onDragListener);
      }
    };
  }, [onDragListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.on('dragend', onDragEndListener);
    return () => {
      if (markerRef.current) {
        markerRef.current.off('dragend', onDragEndListener);
      }
    };
  }, [onDragEndListener]);

  return null;
};

export default Marker;
