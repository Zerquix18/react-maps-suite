import * as L from 'leaflet';
import { MarkerClusterer as GoogleMarkerClusterer } from '@googlemaps/markerclusterer';
import { LoaderOptions } from '@googlemaps/js-api-loader';
import * as mapboxgl from 'mapbox-gl';

export type MapLatLng = {
  lat: number;
  lng: number;
}

export type MapBoundingBox = {
  ne: MapLatLng;
  sw: MapLatLng;
}

export type MapControlPosition = 'TOP_CENTER' | 'TOP_LEFT' | 'TOP_RIGHT' | 'RIGHT_TOP' | 'LEFT_CENTER' | 'LEFT_TOP' | 'RIGHT_CENTER' | 'LEFT_BOTTOM' | 'RIGHT_BOTTOM' | 'BOTTOM_CENTER' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';

export type MapControl = {
  position: MapControlPosition;
  children: React.ReactNode;
}

export type MapEventOnLoadParams = {
  utils: ICurrentMapUtils;
  googleMap?: google.maps.Map;
  mapBox?: mapboxgl.Map;
  leaflet?: L.Map;
}

export type MapEventClickParams = {
  position: MapLatLng;
}

export type MapEventZoomChangeParams = {
  zoom: number;
}

export type MapEventCenterChangeParams = {
  position: MapLatLng;
}

export type MapEventDragParams = {
  position: MapLatLng;
}

export type MapProvider = 'google' | 'mapbox' | 'leaflet';
export type MapEventOnLoad = (event: MapEventOnLoadParams) => void;;
export type MapEventClick = (event: MapEventClickParams) => void;
export type MapEventZoomChange = (event: MapEventZoomChangeParams) => void;
export type MapEventCenterChange = (event: MapEventCenterChangeParams) => void;
export type MapEventDrag = (event: MapEventDragParams) => void;
export type MapEventTypeChange = (type: 'TERRAIN' | 'SATELLITE') => void;

export type MapComponentProps = {
  provider: MapProvider;

  defaultCenter?: MapLatLng;
  defaultZoom?: number;
  center?: MapLatLng;
  zoom?: number;
  height?: number;

  children?: React.ReactNode;

  minZoom?: number;
  maxZoom?: number;
  maxBounds?: MapBoundingBox;

  loadingComponent?: JSX.Element;

  googleLoaderOptions?: LoaderOptions;
  googleOptions?: google.maps.MapOptions;

  mapBoxOptions?: Omit<mapboxgl.MapboxOptions, 'container'>;
  mapBoxLoaderOptions?: { version: string };

  leafletOptions?: L.MapOptions;
  leafletLoaderOptions?: { version: string };

  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
  onZoomChange?: MapEventZoomChange;
  onCenterChange?: MapEventCenterChange;
  onMapLoad?: MapEventOnLoad;
}

export type MapCircleEditEventParams = {
  radius: number;
}

export type MapCircleEditEvent = (event: MapCircleEditEventParams) => void;

export type MapCircle = {
  radius: number; // meters
  position: MapLatLng;
  fillColor: string; // #hex
  fillOpacity?: number;
  strokeColor?: string; // #hex 
  strokeOpacity?: number; // 0-1
  strokeWeight?: number; // px
  zIndex?: number; // z-index

  editable?: boolean; // default false
  draggable?: boolean; // default false 

  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
  onEdited?: MapCircleEditEvent;
  onDragEnd?: MapEventDrag;
}

export type MapPopup = {
  position: MapLatLng;
  children: React.ReactNode;

  onClose?: () => void;
}

export type MapMarkerSize = {
  width: number;
  height: number;
}

export type MapMarkerAnchor = {
  x: number;
  y: number;
}

export type MapMarker = {
  position: MapLatLng;
  imageUrl?: string;

  label?: string;

  size?: MapMarkerSize;
  anchor?: MapMarkerAnchor;
  angle?: number;
  zIndex?: number; // z-index

  draggable?: boolean;

  onDrag?: MapEventDrag;
  onDragEnd?: MapEventDrag;
  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
}

interface MapOverlayBase {
  bounds: MapBoundingBox;

  imageUrl?: string;
  canvas?: HTMLCanvasElement;
  
  angle?: number; // default 0
  elevation?: number; // default 1
  visible?: boolean; // default true

  onClick?: () => void;
}

interface MapOverlayWithImageUrl extends MapOverlayBase {
  imageUrl: string;
}

interface MapOverlayWithCanvas extends MapOverlayBase {
  canvas: HTMLCanvasElement;
}

export type MapOverlay = (MapOverlayWithImageUrl | MapOverlayWithCanvas);

export type MapPolygonEventEditParams = {
  path: MapLatLng[];
}

export type MapPolygonEventDragParams = {
  path: MapLatLng[];
}

export type MapPolygonEventEdit = (event: MapPolygonEventEditParams) => void;
export type MapPolygonEventDrag = (event: MapPolygonEventDragParams) => void;

export type MapPolygon = {
  fillColor: string;
  strokeColor: string;
  path: MapLatLng[];

  fillOpacity?: number;
  strokeOpacity?: number;
  strokeWeight?: number;
  zIndex?: number;

  draggable?: boolean;
  editable?: boolean;

  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
  onEdited?: MapPolygonEventEdit;
  onDragEnd?: MapPolygonEventDrag;
}

export type MapPolylineEventEditParams = {
  path: MapLatLng[];
  position: MapLatLng;
  vertex?: number;
  edge?: number;
}

export type MapPolylineEventDragParams = {
  path: MapLatLng[];
}

export type MapPolylineEventEdit = (event: MapPolylineEventEditParams) => void;
export type MapPolylineEventDrag = (event: MapPolylineEventDragParams) => void;

export type MapPolyline = {
  path: MapLatLng[];

  strokeColor?: string; // #ffffff
  strokeOpacity?: number;
  strokeWeight?: number;
  zIndex?: number;

  draggable?: boolean;
  editable?: boolean;
  dashed?: boolean;

  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
  onEdited?: MapPolylineEventEdit;
  onDragEnd?: MapPolylineEventDrag;
}

export type MapRectangleEventEditParams = {
  bounds: MapBoundingBox;
}

export type MapRectangleEventDragParams = {
  bounds: MapBoundingBox;
}

export type MapRectangleEventEdit = (event: MapRectangleEventEditParams) => void;
export type MapRectangleEventDrag = (event: MapRectangleEventDragParams) => void;

export type MapRectangle = {
  bounds: MapBoundingBox;
  fillColor: string;

  strokeColor?: string;
  fillOpacity?: number;
  strokeOpacity?: number;
  strokeWeight?: number;
  zIndex?: number;

  draggable?: boolean;
  editable?: boolean;

  onClick?: MapEventClick;
  onRightClick?: MapEventClick;
  onEdited?: MapRectangleEventEdit;
  onDragEnd?: MapRectangleEventDrag;
}

export type MapText = {
  text: string;
  bounds: MapBoundingBox;

  color?: string;
  size?: number;

  borderColor?: string;
  borderSize?: number;
  elevation?: number;

  visible?: boolean;
  editable?: boolean;
  draggable?: boolean;

  onClick?: () => void;
  onDragEnd?: MapRectangleEventDrag;
}

export interface MapHeatmapPoint extends MapLatLng {
  weight?: number;
}

export interface MapHeatmap {
  path: MapHeatmapPoint[];

  gradient?: string[];
  dissipating?: boolean;
  maxIntensity?: number;
  radius?: number;
  opacity?: number;
}

export type MapMarkerCluster = {
  googleCluster?: GoogleMarkerClusterer;
  leafletCluster?: L.MarkerClusterGroup;
};

export type ICurrentMapUtils = {
  animateTo: (position: MapLatLng, zoom?: number) => void;
  animateToBounds: (bounds: MapBoundingBox) => void;
  fitToPath: (path: MapLatLng[]) => void;
  getElement: () => HTMLElement | null;
  unproject: (x: number, y: number) => MapLatLng;
}

export type ICurrentMap = {
  type: MapProvider;

  googleMap?: google.maps.Map | null;
  mapBox?: mapboxgl.Map | null;
  leaflet?: L.Map | null;

  center: MapLatLng;
  zoom: number;

  utils: ICurrentMapUtils;
}
