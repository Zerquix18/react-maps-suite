import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '../../../hooks';
import { MapLatLng, MapPolyline } from '../../../models';

function PolylineComponent(props: MapPolyline) {
  const { googleMap } = useMap();
  const { path, strokeColor, strokeWeight, strokeOpacity, zIndex, draggable, editable, onClick, onRightClick, onEdited } = props;
  const polylineRef = useRef<google.maps.Polyline | null>(null);

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

  const onEditedListener = useCallback((event: google.maps.PolyMouseEvent) => {
    if (! onEdited || ! polylineRef.current || ! event.latLng) {
      return;
    }

    if (event.vertex === undefined && event.edge === undefined) {
      return;
    }

    const path = polylineRef.current.getPath();
    const coordinates: MapLatLng[] = [];

    for (let i = 0; i < path.getArray().length; i++) { // path is not iterable
      coordinates.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng(),
      });
    }

    const { vertex, edge } = event;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };

    onEdited({ path: coordinates, vertex, edge, position });
  }, [onEdited]);

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    polylineRef.current = new google.maps.Polyline();
    polylineRef.current.setMap(googleMap);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    polylineRef.current.setOptions({ path, strokeColor, strokeWeight, strokeOpacity, zIndex, editable, draggable })
  }, [strokeColor, strokeWeight, strokeOpacity, zIndex, editable, draggable]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    const listener = polylineRef.current.addListener('click', onClickListener);
    return () => {
      listener.remove();
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    const listener = polylineRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      listener.remove();
    }
  }, [onRightClickListener]);

  useEffect(() => {
    if (! polylineRef.current) {
      return;
    }

    const listener = polylineRef.current.addListener('mouseup', onEditedListener);

    return () => {
      listener.remove();
    };
  }, [onEditedListener]);

  return null;
};

export default PolylineComponent;
