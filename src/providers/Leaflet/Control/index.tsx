import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { MapControl, MapControlPosition } from '../../../models';
import { useMap } from '../../../hooks';

function Control({ position, children }: MapControl) {
  const { leaflet } = useMap();
  const controlId = useId();
  const controlIdRef = useRef(controlId);
  const divRef = useRef(window.L.DomUtil.create('div'));

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    // all ones --> supported by leaflet

    const positions: { [key in MapControlPosition]: 'topright' | 'topleft' | 'bottomright' | 'bottomleft' | '' } = {
      TOP_CENTER: '',
      TOP_LEFT: 'topleft',
      TOP_RIGHT: 'topright',
      RIGHT_TOP: '',
      LEFT_CENTER: '',
      LEFT_TOP: '',
      RIGHT_CENTER: '',
      LEFT_BOTTOM: '',
      RIGHT_BOTTOM: '',
      BOTTOM_CENTER: '',
      BOTTOM_LEFT: 'bottomleft',
      BOTTOM_RIGHT: 'bottomright',
    };

    const actualPosition = positions[position];
    if (! actualPosition) {
      console.warn(`Leaflet only supports: TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT. Got ${position}.`);
      return;
    }

    const id = controlIdRef.current;

    window.L.Control[id] = window.L.Control.extend({
      onAdd: () => {
        return divRef.current;
      },
      onRemove: () => {},
    });

    window.L.control[id] = (opts: any) => new window.L.Control[id](opts);
    const control = window.L.control[controlIdRef.current]({ position: actualPosition });

    control.addTo(leaflet);
    return () => {
      control.remove();
    };
  }, [leaflet, position]);

  return createPortal(children, divRef.current);
};

export default Control;
