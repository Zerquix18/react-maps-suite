import * as React from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import *  as L from 'leaflet';
import { ICurrentMap, MapMarkerCluster } from '../models';

export const MapContext = React.createContext<ICurrentMap | null>(null);

interface MapProviderProps {
  map: ICurrentMap | null;
  children: React.ReactNode;
}

export function MapProvider({ map, children }: MapProviderProps) {
  return (
    <MapContext.Provider value={map}>
      { children }
    </MapContext.Provider>
  );
}

export const MapMarkerClusterContext = React.createContext<MapMarkerCluster | null>(null);

interface MapMarkerClusterProviderProps {
  googleCluster?: MarkerClusterer;
  leafletCluster?: L.MarkerClusterGroup;
  children: React.ReactNode;
}

export function MapMarkerClusterProvider ({ googleCluster, leafletCluster, children }: MapMarkerClusterProviderProps) {
  return (
    <MapMarkerClusterContext.Provider value={{ googleCluster, leafletCluster }}>
      { children }
    </MapMarkerClusterContext.Provider>
  )
};
