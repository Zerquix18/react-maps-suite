import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useMap } from '../../../hooks';
import { MapPopup } from '../../../models';

function Popup({ position, children, onClose }: MapPopup) {
  const { googleMap } = useMap();
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const divRef = useRef(document.createElement('div'));

  const onCloseListener = useCallback(() => {
    if (! onClose) {
      return;
    }

    onClose();
  }, [onClose]);

  const optionsRef = useRef({ map: googleMap, position });

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    infoWindowRef.current = new google.maps.InfoWindow({ ...optionsRef.current, disableAutoPan: true });
    infoWindowRef.current.setContent(divRef.current);
    infoWindowRef.current.open(googleMap);

    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    }
  }, [googleMap]);

  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.setPosition(position);
    }
  }, [position]);

  useEffect(() => {
    if (! infoWindowRef.current) {
      return;
    }

    const listener = infoWindowRef.current.addListener('closeclick', onCloseListener);

    return () => {
      listener.remove();
    };
  }, [onCloseListener]);

  return createPortal(children, divRef.current);
};

export default Popup;
