import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useMap } from '../../../hooks';
import { MapControl } from '../../../models';

function Control({ position, children }: MapControl) {
  const { googleMap } = useMap();
  const divRef = useRef(document.createElement('div'));

  useEffect(() => {
    if (! googleMap) {
      return;
    }

    const googleMapPosition = google.maps.ControlPosition[position];
    const index = googleMap.controls[googleMapPosition].push(divRef.current);

    return () => {
      if (googleMap.controls[googleMapPosition].getAt(index)) {
        googleMap.controls[googleMapPosition].removeAt(index);
      }
    };
  }, [googleMap, position]);

  return createPortal(children, divRef.current);
};

export default Control;
