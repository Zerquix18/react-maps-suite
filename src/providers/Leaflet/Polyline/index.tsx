import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapPolyline } from '../../../models';

// unsupported props: editable, draggable, zIndex, onEdited

function Polyline(props: MapPolyline) {
  const { leaflet } = useMap();
  const { path, strokeColor, strokeWeight, strokeOpacity, dashed, onClick, onRightClick } = props;
  const polylineRef = useRef<L.Polyline | null>(null);

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

    polylineRef.current = new window.L.Polyline(defaultPathRef.current.map(({ lat, lng }) => [lat, lng]));
    polylineRef.current.addTo(leaflet);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.remove();
      }
    };

  }, [leaflet]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    polylineRef.current.setLatLngs(path.map(({ lat, lng }) => [lat, lng]));
  }, [path]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    // todo: review this assumption, [20, 10] is kind of arbitrary
    const dashArray = dashed ? [20, 10] : undefined;

    polylineRef.current.setStyle({
      color: strokeColor,
      opacity: strokeOpacity,
      fillOpacity: strokeOpacity,
      dashArray
    });
  }, [dashed, strokeColor, strokeWeight, strokeOpacity]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    polylineRef.current.on('click', onClickListener);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    polylineRef.current.on('contextmenu', onRightClickListener);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.off('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  return null;
};

export default Polyline;
