import { useCallback, useEffect, useRef } from 'react';
import { useMap, useMapCluster } from '../../../hooks';
import { MapMarker } from '../../../models';

function Marker(props: MapMarker) {
  const { leaflet } = useMap();
  const markerCluster = useMapCluster();

  const markerRef = useRef<L.Marker | null>(null);
  const defaultsRef = useRef(props);
  const markerClusterRef = useRef(markerCluster && markerCluster.leafletCluster ? markerCluster.leafletCluster : null);

  const { position, imageUrl, label, size, anchor, angle, zIndex, draggable, onClick, onRightClick, onDrag, onDragEnd } = props;

  const onClickListener = useCallback((event: L.LeafletMouseEvent) => {
    const position = event.latlng;

    if (onClick) {
      onClick({ position });
    }
  }, [onClick]);

  const onRightClickListener = useCallback((event: L.LeafletMouseEvent) => {
    const position = event.latlng;

    if (onRightClick) {
      onRightClick({ position });
    }
  }, [onRightClick]);

  const onDragListener = useCallback((event: L.LeafletEvent) => {
    if (! onDrag) {
      return;
    }

    const position = event.target._latlng;

    onDrag({ position });
  }, [onDrag]);

  const onDragEndListener = useCallback((event: L.DragEndEvent) => {
    if (! onDragEnd) {
      return;
    }

    const position = event.target._latlng;

    onDragEnd({ position });
  }, [onDragEnd]);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    const { position, zIndex, imageUrl, size, anchor, draggable, angle } = defaultsRef.current;
    
    let iconSize: L.Point | undefined;
    let iconAnchor: L.Point | undefined;

    if (size) {
      iconSize = new window.L.Point(size.width, size.height);
    }

    if (anchor) {
      iconAnchor = new window.L.Point(anchor.x, anchor.y);
    }

    const icon = new window.L.Icon({
      iconUrl: imageUrl,
      iconSize,
      iconAnchor,
    });
    
    markerRef.current = new window.L.Marker(
      [position.lat, position.lng],
      {
        rotationAngle: angle,
        icon,
        draggable,
        zIndexOffset: zIndex,
      }
    )

    const cluster = markerClusterRef.current;
    if (cluster) {
      cluster.addLayer(markerRef.current);
    } else {
      markerRef.current.addTo(leaflet);
    }

    return () => {
      if (cluster && markerRef.current) {
        cluster.removeLayer(markerRef.current)
      } else if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [leaflet]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setLatLng(position);
  }, [position]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    let iconSize: L.Point | undefined;
    let iconAnchor: L.Point | undefined;

    if (size) {
      iconSize = new window.L.Point(size.width, size.height);
    }

    if (anchor) {
      iconAnchor = new window.L.Point(anchor.x, anchor.y);
    }

    const icon = new window.L.Icon({
      iconUrl: imageUrl,
      iconSize,
      iconAnchor,
    });

    markerRef.current.setIcon(icon);
  }, [imageUrl, size, anchor]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setRotationAngle(angle || 0);
  }, [angle]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setZIndexOffset(zIndex || 1);
  }, [zIndex]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    if (! markerRef.current.dragging) {
      return;
    }

    // https://gis.stackexchange.com/a/169505/152006
    if (draggable) {
      markerRef.current.dragging.enable();
    } else {
      markerRef.current.dragging.disable();
    }
  }, [draggable]); 

  useEffect(() => {
    if (! markerRef.current || ! label) {
      return;
    }

    markerRef.current.bindTooltip(label, { permanent: true, direction: 'bottom' });

    return () => {
      if (markerRef.current) {
        markerRef.current.unbindTooltip();
      }
    };
  }, [label]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setRotationAngle(props.angle || 0);
  }, [props.angle]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.on('click', onClickListener);
    return () => {
      if (markerRef.current) {
        markerRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.on('contextmenu', onRightClickListener);
    return () => {
      if (markerRef.current) {
        markerRef.current.off('contextmenu', onRightClickListener);
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
