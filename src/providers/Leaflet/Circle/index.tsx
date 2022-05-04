import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapCircle } from '../../../models';

// unsupported props: zIndex, editable, draggable, onEdited, onDragEnd

function Circle(props: MapCircle) {
  const { leaflet } = useMap();
  const circleRef = useRef<L.Circle | null>(null);

  const { radius, position, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, onClick, onRightClick } = props;
  const defaultPositionRef = useRef(position);

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

    circleRef.current = new window.L.Circle(defaultPositionRef.current);
    circleRef.current.addTo(leaflet);
    
    return () => {
      if (circleRef.current) {
        circleRef.current.remove();
      }
    };
  }, [leaflet]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    circleRef.current.setLatLng(position);
  }, [position]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    circleRef.current.setRadius(radius);
  }, [radius]);

  useEffect(() => {
    if (! circleRef.current) {
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

    circleRef.current.setStyle(style);
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    circleRef.current.on('click', onClickListener);

    return () => {
      if (circleRef.current) {
        circleRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    circleRef.current.on('contextmenu', onRightClickListener);

    return () => {
      if (circleRef.current) {
        circleRef.current.off('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  return null;
};

export default Circle;
