import { useEffect, useRef, useCallback } from 'react';

import { useMap } from '../../../hooks';
import { MapLatLng, MapPolygon } from '../../../models';

function Polygon(props: MapPolygon) {
  const { googleMap } = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const dragging = useRef(false);

  const {
    path,
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
    if (! onEdited || ! polygonRef.current || dragging.current) {
      return;
    }

    const path = polygonRef.current.getPath();
    const coordinates: MapLatLng[] = [];

    for (let i = 0; i < path.getArray().length; i++) { // path is not iterable
      coordinates.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng(),
      });
    }

    onEdited({ path: coordinates });
  }, [onEdited]);

  const onDragStartListener = useCallback(() => {
    dragging.current = true;
  }, []);

  const onDragEndListener = useCallback(() => {
    dragging.current = false;

    if (! onDragEnd || ! polygonRef.current) {
      return;
    }

    const path = polygonRef.current.getPath();
    const coordinates: MapLatLng[] = [];

    for (let i = 0; i < path.getArray().length; i++) { // path is not iterable
      coordinates.push({
        lat: path.getAt(i).lat(),
        lng: path.getAt(i).lng(),
      });
    }

    onDragEnd({ path: coordinates });
  }, [onDragEnd]);

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    polygonRef.current = new google.maps.Polygon();
    polygonRef.current.setMap(googleMap);

    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [googleMap]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }
    
    polygonRef.current.setPath(path);
  }, [path]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    polygonRef.current.setOptions({ fillColor, strokeColor, fillOpacity, strokeOpacity, strokeWeight, zIndex, draggable, editable });
  }, [fillColor, strokeColor, fillOpacity, strokeOpacity, strokeWeight, zIndex, draggable, editable]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    const listener = polygonRef.current.addListener('click', onClickListener);
    return () => {
      listener.remove();
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    const listener = polygonRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      listener.remove();
    };
  }, [onRightClickListener]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    const listener = polygonRef.current.getPath().addListener('insert_at', onEditedListener);
    const listener2 = polygonRef.current.getPath().addListener('remove_at', onEditedListener);
    const listener3 = polygonRef.current.getPath().addListener('set_at', onEditedListener);

    return () => {
      listener.remove();
      listener2.remove();
      listener3.remove();
    };
  }, [onEditedListener]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    const listener = polygonRef.current.addListener('dragstart', onDragStartListener);
    return () => {
      listener.remove();
    };
  }, [onDragStartListener]);

  useEffect(() => {
    if (! polygonRef.current) {
      return;
    }

    const listener = polygonRef.current.addListener('dragend', onDragEndListener);
    return () => {
      listener.remove();
    };
  }, [onDragEndListener]);

  return null;
};

export default Polygon;
