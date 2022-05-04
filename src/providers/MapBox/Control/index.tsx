import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useMap } from '../../../hooks';
import { MapControl, MapControlPosition } from '../../../models';

function Control({ position, children }: MapControl) {
  const { mapBox } = useMap();
  const divRef = useRef(document.createElement('div'));

  useEffect(() => {
    if (! mapBox) {
      return;
    }

    divRef.current.classList.add('mapboxgl-ctrl');

    // all ones --> supported by mapbox

    const positions: { [key in MapControlPosition]: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | '' } = {
      TOP_CENTER: '',
      TOP_LEFT: 'top-left',
      TOP_RIGHT: 'top-right',
      RIGHT_TOP: '',
      LEFT_CENTER: '',
      LEFT_TOP: '',
      RIGHT_CENTER: '',
      LEFT_BOTTOM: '',
      RIGHT_BOTTOM: '',
      BOTTOM_CENTER: '',
      BOTTOM_LEFT: 'bottom-left',
      BOTTOM_RIGHT: 'bottom-right',
    };

    const actualPosition = positions[position];
    if (! actualPosition) {
      console.warn(`MapBox onlly supports TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT. Got ${position}.`);
      return;
    }

    const customControl = new CustomControl(divRef.current, position);
    mapBox.addControl(customControl, actualPosition);

    return () => {
      mapBox.removeControl(customControl);
    };
  }, [mapBox, position]);

  return createPortal(children, divRef.current);
};

class CustomControl {
  div: HTMLDivElement;
  position: MapControlPosition; // to do
  map?: mapboxgl.Map;

  constructor(div: HTMLDivElement, position: MapControlPosition) {
    this.div = div;
    this.position = position;
  }

  onAdd = (map: mapboxgl.Map) => {
    this.map = map;
    return this.div;
  }

  onRemove = () => {
    if (this.div.parentNode) {
      this.div.parentNode.removeChild(this.div);
    }
    this.map = undefined;
  }
}

export default Control;
