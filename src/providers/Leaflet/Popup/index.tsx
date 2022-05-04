import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useMap } from '../../../hooks';
import { MapPopup } from '../../../models';

function Popup({ position, children, onClose }: MapPopup) {
  const { leaflet } = useMap();
  const popupRef = useRef<L.Popup | null>(null);
  const divRef = useRef(document.createElement('div'));
  const positionRef = useRef(position);

  const onCloseListener = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    popupRef.current = new window.L.Popup();
    popupRef.current.setContent(divRef.current);
    popupRef.current.setLatLng(positionRef.current);
    popupRef.current.addTo(leaflet);

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, [leaflet]);

  useEffect(() => {
    if (! popupRef.current) {
      return;
    }

    popupRef.current.setLatLng(position);
  }, [position]);

  useEffect(() => {
    if (! leaflet || ! popupRef.current) {
      return;
    }

    leaflet.on('popupclose', onCloseListener, popupRef.current);

    return () => {
      leaflet.off('popupclose', onCloseListener, popupRef.current);
    }
  }, [leaflet, onCloseListener]);

  return createPortal(children, divRef.current);
};

export default Popup;
