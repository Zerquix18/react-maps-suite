import * as React from 'react';

import { useMap } from '../../hooks';
import { MapPopup } from '../../models';

import GooglePopup from '../../providers/GoogleMap/Popup';
import MapBoxPopup from '../../providers/MapBox/Popup';
import LeafletPopup from '../../providers/Leaflet/Popup';

function Popup(props: MapPopup) {
  const { type } = useMap();

  if (type === 'google') {
    return <GooglePopup {...props} />;
  }

  if (type === 'mapbox') {
    return <MapBoxPopup {...props} />;
  }

  if (type === 'leaflet') {
    return <LeafletPopup {...props} />;
  }

  return null;
};

export default Popup;
