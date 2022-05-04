import { useContext } from "react";
import { MapContext, MapMarkerClusterContext } from "../context";

export const useMap = () => {
  const mapContext = useContext(MapContext);
  if (! mapContext) {
    throw new Error('Using useMap or one of the maps components from outside provider');
  }

  return mapContext;
};

export const useMapCluster = () => {
  const mapMarkerCluster = useContext(MapMarkerClusterContext);

  return mapMarkerCluster;
};
