import { useEffect, useRef, useCallback } from 'react';

import { useMap } from '../../../hooks';
import { MapCircle } from '../../../models';

function Circle(props: MapCircle) {
  const { googleMap } = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  const {
    radius,
    position,
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    strokeWeight,
    zIndex,
    editable,
    draggable,
    onClick,
    onRightClick,
    onEdited,
    onDragEnd,
  } = props;

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

  const onEditedListener = useCallback(() => {
    if (! circleRef.current || ! onEdited) {
      return;
    }

    const radius = circleRef.current.getRadius();
    onEdited({ radius });
  }, [onEdited]);

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

    circleRef.current = new google.maps.Circle();
    circleRef.current.setMap(googleMap);

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    circleRef.current.setCenter(position);
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

    circleRef.current.setOptions({ fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, zIndex, editable, draggable });
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, zIndex, editable, draggable]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    const listener = circleRef.current.addListener('click', onClickListener);
    return () => {
      listener.remove();
    }
  }, [onClickListener]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    const listener = circleRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      listener.remove();
    }
  }, [onRightClickListener]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    const listener = circleRef.current.addListener('radius_changed', onEditedListener);
    return () => {
      listener.remove();
    }
  }, [onEditedListener]);

  useEffect(() => {
    if (! circleRef.current) {
      return;
    }

    const listener = circleRef.current.addListener('dragend', onDragEndListener);
    return () => {
      listener.remove();
    }
  }, [onDragEndListener]);

  return null;
};

export default Circle;
