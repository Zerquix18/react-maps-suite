import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapPolygon } from '../../../models';

// unsupported props: editable, draggable, zIndex, onEdited

function Polygon(props: MapPolygon) {
  const { leaflet } = useMap();
  const { path, fillColor, fillOpacity, strokeColor, strokeWeight, strokeOpacity, onClick, onRightClick } = props;
  const polygonRef = useRef<L.Polygon | null>(null);

  const defaultPathRef = useRef(path);

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

    polygonRef.current = new window.L.Polygon(defaultPathRef.current.map(({ lat, lng }) => [lat, lng]));
    polygonRef.current.addTo(leaflet);

    return () => {
      if (polygonRef.current) {
        polygonRef.current.remove();
      }
    };

  }, [leaflet]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    polygonRef.current.setLatLngs(path.map(({ lat, lng }) => [lat, lng]));
  }, [path]);

  useEffect(() => {
    if (! polygonRef.current) {
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

    polygonRef.current.setStyle(style);
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    polygonRef.current.on('click', onClickListener);

    return () => {
      if (polygonRef.current) {
        polygonRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    polygonRef.current.on('contextmenu', onRightClickListener);

    return () => {
      if (polygonRef.current) {
        polygonRef.current.off('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  return null;
};

export default Polygon;
