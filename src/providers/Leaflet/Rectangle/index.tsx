import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapRectangle } from '../../../models';

// unsupported props: editable, draggable, zIndex, onEdited

function Rectangle(props: MapRectangle) {
  const { leaflet } = useMap();
  const { bounds, fillColor, fillOpacity, strokeColor, strokeWeight, strokeOpacity, onClick, onRightClick } = props;
  const rectangleRef = useRef<L.Rectangle | null>(null);

  const defaultBoundsRef = useRef(bounds);

  const onClickListener = useCallback((event: L.LeafletMouseEvent) => {
    if (! onClick) {
      return;
    }

    const position = event.latlng;
    onClick({ position });
  }, [onClick]);

  const onRightClickListener = useCallback((event: L.LeafletMouseEvent) => {
    if (! onRightClick) {
      return;
    }

    const position = event.latlng;
    onRightClick({ position });
  }, [onRightClick]);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    const bounds = defaultBoundsRef.current;
    rectangleRef.current = new window.L.Rectangle(new window.L.LatLngBounds(bounds.sw, bounds.ne));
    rectangleRef.current.addTo(leaflet);

    return () => {
      if (rectangleRef.current) {
        rectangleRef.current.remove();
      }
    };
  }, [leaflet]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    rectangleRef.current.setBounds(new window.L.LatLngBounds(bounds.sw, bounds.ne))
  }, [bounds]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const style: { [key: string] : string } = {};
    if (fillColor) {
      style.fillColor = fillColor;
    }
    if (fillOpacity) {
      style.fillOpacity = String(fillOpacity);
    }
    if (strokeColor) {
      style.color = strokeColor;
    }
    if (strokeWeight) {
      style.weight = String(strokeWeight);
    }
    if (strokeOpacity) {
      style.opacity = String(strokeOpacity);
    }

    rectangleRef.current.setStyle(style);
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    rectangleRef.current.on('click', onClickListener);

    return () => {
      if (rectangleRef.current) {
        rectangleRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    rectangleRef.current.on('contextmenu', onRightClickListener);

    return () => {
      if (rectangleRef.current) {
        rectangleRef.current.off('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  return null;
}

export default Rectangle;
