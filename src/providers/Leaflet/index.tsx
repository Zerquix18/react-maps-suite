import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type * as L from 'leaflet';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MapProvider } from '../../context';
import { MapBoundingBox, MapComponentProps, MapLatLng } from '../../models';
import { DEFAULT_CENTER, DEFAULT_LEAFLET_VERSION, DEFAULT_ZOOM } from '../../constants';

function Leaflet(props: MapComponentProps) {
  const defaultCenter = props.defaultCenter || props.center || DEFAULT_CENTER;
  const defaultZoom = props.defaultZoom || props.zoom || DEFAULT_ZOOM;

  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onMapLoadRef = useRef(props.onMapLoad);

  const defaultCenterRef = useRef(defaultCenter);
  const defaultZoomRef = useRef(defaultZoom);

  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [loaded, setLoaded] = useState(false);

  const { onCenterChange, onZoomChange, onClick, onRightClick } = props;

  const onCenterChangeListener = useCallback(() => {
    if (! mapRef.current) {
      return;
    }

    const centerResult = mapRef.current.getCenter();
    const { lat, lng } = centerResult;

    const position = { lat, lng };

    setCenter(position);

    if (onCenterChange) {
      onCenterChange({ position });
    }
  }, [onCenterChange]);

  const onClickListener = useCallback((event: L.LeafletMouseEvent) => {
    if (! mapRef.current) {
      return;
    }

    const { lat, lng } = event.latlng;
    const position = { lat, lng };

    if (onClick) {
      onClick({ position });
    }
  }, [onClick]);

  const onRightClickListener = useCallback((event: L.LeafletMouseEvent) => {
    if (! mapRef.current) {
      return;
    }
    
    const { lat, lng } = event.latlng;
    const position = { lat, lng };

    if (onRightClick) {
      onRightClick({ position });
    }
  }, [onRightClick]);

  const onZoomChangeListener = useCallback(() => {
    if (! mapRef.current) {
      return;
    }

    const zoom = mapRef.current.getZoom();
    setZoom(zoom);
    if (onZoomChange) {
      onZoomChange({ zoom });
    }
  }, [onZoomChange]);

  const animateTo = useCallback((position: MapLatLng, zoom?: number) => {
    if (! mapRef.current) {
      return;
    }

    if (typeof zoom === 'number') {
      mapRef.current.setView(position, zoom, { animate: true });
    } else {
      mapRef.current.panTo(position, { animate: true });
    }

  }, []);

  const animateToBounds = useCallback((bounds: MapBoundingBox) => {
    if (! mapRef.current) {
      return;
    }

    const leafletBounds = new window.L.LatLngBounds(bounds.sw, bounds.ne);
    mapRef.current.fitBounds(leafletBounds, { animate: true });
  }, []);

  const fitToPath = useCallback((path: MapLatLng[]) => {
    if (! mapRef.current) {
      return;
    }

    const leafletBounds = new window.L.LatLngBounds(path.map(item => {
      const { lat, lng } = item;
      return [lat, lng];
    }));
    mapRef.current.fitBounds(leafletBounds, { animate: true });
  }, []);

  const getElement = useCallback(() => divRef.current, []);

  const unproject = useCallback((x: number, y: number) => {
    if (! mapRef.current) {
      throw new Error('Cannot project with unloaded map.');
    }
    return mapRef.current.unproject([x, y]);
  }, []);

  const utils = useMemo(() => ({
    animateTo,
    animateToBounds,
    fitToPath,
    getElement,
    unproject,
  }), [animateTo, animateToBounds, fitToPath, getElement, unproject]);

  useEffect(() => {
    if (! divRef.current) {
      return;
    }

    mapRef.current = new window.L.Map(divRef.current, {
      center: defaultCenterRef.current,
      zoom: defaultZoomRef.current,
    });

    mapRef.current.whenReady(() => {
      if (onMapLoadRef.current && mapRef.current) {
        onMapLoadRef.current({ leaflet: mapRef.current, utils });
      }
      setLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [utils]);

  useEffect(() => {
    if (mapRef.current && props.zoom) {
      mapRef.current.setZoom(props.zoom);
    }
  }, [props.zoom]);

  useEffect(() => {
    if (mapRef.current && props.center) {
      mapRef.current.panTo(props.center);
    }
  }, [props.center]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }

    mapRef.current.setMinZoom(props.minZoom || 1);
  }, [props.minZoom]);

  useEffect(() => {
    if (! mapRef.current || props.maxZoom) {
      return;
    }

    mapRef.current.setMaxZoom(props.maxZoom || 20);
  }, [props.maxZoom]);

  useEffect(() => {
    if (! mapRef.current || ! props.maxBounds) {
      return;
    }

    const bounds = new window.L.LatLngBounds(props.maxBounds.sw, props.maxBounds.ne);
    mapRef.current.setMaxBounds(bounds);
  }, [props.maxBounds]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }

    mapRef.current.on('zoomend', onZoomChangeListener);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('zoomend', onZoomChangeListener);
      }
    };
  }, [onZoomChangeListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }

    mapRef.current.on('moveend', onCenterChangeListener);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend', onCenterChangeListener);
      }
    };
  }, [onCenterChangeListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }
      
    mapRef.current.on('click', onClickListener);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', onClickListener);
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }
      
    mapRef.current.on('contextmenu', onRightClickListener);
    return () => {
      if (mapRef.current) {
        mapRef.current.off('contextmenu', onRightClickListener);
      }
    };
  }, [onRightClickListener]);

  return (
    <MapProvider map={{ center, zoom, leaflet: mapRef.current, type: 'leaflet', utils }}>
      <div ref={divRef} style={{ height: props.height || '85vh', width: '100%' }} />
      { loaded ? props.children : null }
    </MapProvider>
  );
};

let loadedScript = false;
let loadedCss = false;
let loadedDependencies = false;

function LeafletWrapper(props: MapComponentProps) {
  const { leafletLoaderOptions, loadingComponent } = props;

  const [loadingDependencies, setLoadingDependencies] = useState(! loadedDependencies);
  const [loadingScript, setLoadingScript] = useState(! loadedScript);
  const [loadingCss, setLoadingCss] = useState(! loadedCss);

  const versionRef = useRef(leafletLoaderOptions ? leafletLoaderOptions.version : DEFAULT_LEAFLET_VERSION);

  const loadDependencies = useCallback(() => {
    Promise.all([
      import('leaflet.markercluster'),
      import('leaflet.heat'),
      import('leaflet-rotatedmarker'),
    ]).then(() => {
      setLoadingDependencies(false);
      loadedDependencies = true;
    });
  }, []);

  const loadCss = useCallback(() => {
    if (loadedCss) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';

    link.onload = () => {
      setLoadingCss(false);
      loadedCss = true;
    };
    link.href = `https://unpkg.com/leaflet@${versionRef.current}/dist/leaflet.css`;
    document.head.appendChild(link);
  }, []);

  const loadScript = useCallback(() => {
    if (loadedScript) {
      return;
    }

    const script = document.createElement('script');
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      setLoadingScript(false);
      loadedScript = true;
      loadDependencies();
    };
    script.src = `https://unpkg.com/leaflet@${versionRef.current}/dist/leaflet.js`;
    document.head.appendChild(script);
  }, [loadDependencies]);

  useEffect(() => {
    loadScript();
    loadCss();
  }, [loadCss, loadScript]);

  if (loadingCss || loadingScript || loadingDependencies) {
    return loadingComponent ? loadingComponent : <div>Loading...</div>;
  }

  return <Leaflet {...props} />;
};

export default LeafletWrapper;
