import { useEffect, useRef, useCallback } from 'react';
import { useMap } from '../../../hooks';
import { MapRectangle } from '../../../models';

function Rectangle(props: MapRectangle) {
  const { googleMap } = useMap();
  const rectangleRef = useRef<google.maps.Rectangle | null>(null);

  const {
    bounds,
    fillColor,
    strokeColor,
    fillOpacity,
    strokeOpacity,
    strokeWeight,
    zIndex,
    draggable,
    editable,
    onClick,
    onRightClick,
    onDragEnd,
    onEdited,
  } = props;

  const onClickListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! onClick || ! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };
    onClick({ position });

  }, [googleMap, onClick]);

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
    if (! onEdited || ! rectangleRef.current) {
      return;
    }

    const googleBounds = rectangleRef.current.getBounds();
    if (! googleBounds) {
      return;
    }

    const bounds = {
      sw: {
        lat: googleBounds.getSouthWest().lat(),
        lng: googleBounds.getSouthWest().lng(),
      },
      ne: {
        lat: googleBounds.getNorthEast().lat(),
        lng: googleBounds.getNorthEast().lng(),
      }
    };

    onEdited({ bounds });
  }, [onEdited]);

  const onDragEndListener = useCallback(() => {
    if (! onDragEnd || ! rectangleRef.current) {
      return;
    }

    const googleBounds = rectangleRef.current.getBounds();
    if (! googleBounds) {
      return;
    }

    const bounds = {
      sw: {
        lat: googleBounds.getSouthWest().lat(),
        lng: googleBounds.getSouthWest().lng(),
      },
      ne: {
        lat: googleBounds.getNorthEast().lat(),
        lng: googleBounds.getNorthEast().lng(),
      }
    };

    onDragEnd({ bounds });
  }, [onDragEnd]);

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    rectangleRef.current = new google.maps.Rectangle();
    rectangleRef.current.setMap(googleMap);

    return () => {
      if (rectangleRef.current) {
        rectangleRef.current.setMap(null);
      }
    }
  }, [googleMap]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const ne = new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng);
    const sw = new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng);
    const boundingBox = new google.maps.LatLngBounds(ne, sw);
    rectangleRef.current.setBounds(boundingBox);
  }, [bounds]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    rectangleRef.current.setOptions({ fillColor, strokeColor, fillOpacity, strokeOpacity, strokeWeight, zIndex, draggable, editable });
  }, [fillColor, strokeColor, fillOpacity, strokeOpacity, strokeWeight, zIndex, draggable, editable]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const listener = rectangleRef.current.addListener('click', onClickListener);
    return () => {
      listener.remove();
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const listener = rectangleRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      listener.remove();
    }
  }, [onRightClickListener]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const listener = rectangleRef.current.addListener('bounds_changed', onEditedListener);
    return () => {
      listener.remove();
    };
  }, [onEditedListener]);

  useEffect(() => {
    if (! rectangleRef.current) {
      return;
    }

    const listener = rectangleRef.current.addListener('dragend', onDragEndListener);
    return () => {
      listener.remove();
    };
  }, [onDragEndListener]);

  return null;
};

export default Rectangle;
