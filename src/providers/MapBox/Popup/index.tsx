import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { MapPopup } from '../../../models';
import { useMap } from '../../../hooks';

function Popup({ position, children, onClose }: MapPopup) {
  const { mapBox } = useMap();
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const divRef = useRef(document.createElement('div'));

  const defaultProps = useRef({ position });

  const onCloseListener = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (! mapBox) {
      return;
    }

    const { position } = defaultProps.current;
    
    popupRef.current = new window.mapboxgl.Popup();
    popupRef.current.setDOMContent(divRef.current);
    popupRef.current.setLngLat(position);

    popupRef.current.addTo(mapBox);
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    }
  }, [mapBox]);

  useEffect(() => {
    if (! popupRef.current) {
      return;
    }
    popupRef.current.setLngLat(position);
  }, [position]);

  useEffect(() => {
    if (! popupRef.current) {
      return;
    }

    popupRef.current.on('close', onCloseListener);

    return () => {
      if (popupRef.current) {
        popupRef.current.off('close', onCloseListener);
      }
    }
  }, [onClose]);
  
  return createPortal(children, divRef.current);
};

export default Popup;
