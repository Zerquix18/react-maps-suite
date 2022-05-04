import { useEffect, useRef, useCallback } from 'react';

import { useMap, useMapCluster } from '../../../hooks';
import { MapMarker } from '../../../models';

// Unsupported props: angle

function Marker(props: MapMarker) {
  const { googleMap } = useMap();
  const markerCluster = useMapCluster();

  const markerRef = useRef<google.maps.Marker | null>(null);
  const markerClusterRef = useRef(markerCluster);

  const { position, imageUrl, label, size, anchor, zIndex, draggable, onClick, onRightClick, onDrag, onDragEnd } = props;

  const onClickListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! onClick || ! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    onClick({ position });
  }, [onClick]);

  const onRightClickListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! onRightClick || ! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    onRightClick({ position });
  }, [onRightClick]);

  const onDragListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! onDrag || ! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    onDrag({ position });
  }, [onDrag]);

  const onDragEndListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! onDragEnd || ! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    onDragEnd({ position });
  }, [onDragEnd]);


  useEffect(() => {
    if (! googleMap) {
      return;
    }

    markerRef.current = new google.maps.Marker();

    if (markerClusterRef.current && markerClusterRef.current.googleCluster) {
      markerClusterRef.current.googleCluster.addMarker(markerRef.current);
    } else {
      markerRef.current.setMap(googleMap);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    if (! imageUrl) {
      markerRef.current.setIcon(null);
      return;
    }

    const url = imageUrl;
    let scaledSize: google.maps.Size | undefined;
    let googleAnchor: google.maps.Point | undefined;

    if (size) {
      scaledSize = new google.maps.Size(size.width, size.height);
    }

    if (anchor) {
      googleAnchor = new google.maps.Point(anchor.x, anchor.y);
    }

    const icon: google.maps.Icon = { url, scaledSize, anchor: googleAnchor };
    markerRef.current.setIcon(icon);
  }, [imageUrl, size, anchor]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }
    
    markerRef.current.setPosition(position);
  }, [googleMap, position]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }
    
    markerRef.current.setLabel(label || null);
  }, [googleMap, label]);

  useEffect(() => {

  }, [props.imageUrl]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setDraggable(!! draggable);
  }, [draggable]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    markerRef.current.setZIndex(zIndex);
  }, [zIndex]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    const listener = markerRef.current.addListener('click', onClickListener);
    return () => {
      listener.remove();
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    const listener = markerRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      listener.remove();
    };
  }, [onRightClickListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    const listener = markerRef.current.addListener('dragend', onDragEndListener);
    return () => {
      listener.remove();
    };
  }, [onDragEndListener]);

  useEffect(() => {
    if (! markerRef.current) {
      return;
    }

    const listener = markerRef.current.addListener('drag', onDragListener);
    return () => {
      listener.remove();
    };
  }, [onDragListener]);

  return null;
};

export default Marker;
