import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MapProvider } from '../../context';
import { MapBoundingBox, MapComponentProps, MapLatLng } from '../../models';
import { DEFAULT_CENTER, DEFAULT_MAPBOX_VERSION, DEFAULT_ZOOM } from '../../constants';

function MapBox(props: MapComponentProps) {
  const defaultCenter = props.defaultCenter || props.center || DEFAULT_CENTER;
  const defaultZoom = props.defaultZoom || props.zoom || DEFAULT_ZOOM;

  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const defaultCenterRef = useRef(defaultCenter);
  const defaultZoomRef = useRef(defaultZoom);
  const defaultOptionsRef = useRef(props.mapBoxOptions);
  const onMapLoadRef = useRef(props.onMapLoad);

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

  const onClickListener = useCallback((event: mapboxgl.MapMouseEvent) => {
    if (! mapRef.current) {
      return;
    }

    const { lat, lng } = event.lngLat;
    const position = { lat, lng };
    
    if (onClick) {
      onClick({ position });
    }
  }, [onClick]);

  const onRightClickListener = useCallback((event: mapboxgl.MapMouseEvent) => {
    if (! mapRef.current) {
      return;
    }
    
    const { lat, lng } = event.lngLat;
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

  const animateTo = useCallback((position: MapLatLng) => {
    if (! mapRef.current) {
      return;
    }

    mapRef.current.panTo(position);
  }, []);

  const animateToBounds = useCallback((bounds: MapBoundingBox) => {
    if (! mapRef.current) {
      return;
    }

    const googleBounds = new window.mapboxgl.LngLatBounds(bounds.sw, bounds.ne);
    mapRef.current.fitBounds(googleBounds);
  }, []);

  const fitToPath = useCallback((path: MapLatLng[]) => {
    if (! mapRef.current) {
      return;
    }

    const bounds = new window.mapboxgl.LngLatBounds();

    path.forEach(position => {
      const { lat, lng } = position;
      const lngLat = new window.mapboxgl.LngLat(lng, lat);

      bounds.extend(lngLat);
    });

    mapRef.current.fitBounds(bounds);
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

    if (defaultOptionsRef.current && defaultOptionsRef.current.accessToken) {
      window.mapboxgl.accessToken = defaultOptionsRef.current.accessToken;
    }

    mapRef.current = new window.mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v11',
      container: divRef.current,
      center: defaultCenterRef.current,
      zoom: defaultZoomRef.current,
      ...defaultOptionsRef.current,
    });

    mapRef.current.on('load', () => {
      setLoaded(true); // trigger a re-render so the mapbox ref is propagated 

      if (mapRef.current && onMapLoadRef.current) {
        onMapLoadRef.current({ mapBox: mapRef.current, utils });
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    }
  }, [utils]);

  useEffect(() => {
    if (mapRef.current && props.zoom) {
      mapRef.current.setZoom(props.zoom);
    }
  }, [props.zoom]);

  useEffect(() => {
    if (mapRef.current && props.center) {
      mapRef.current.setCenter(props.center);
    }
  }, [props.center]);

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
    <MapProvider map={{ center, zoom, mapBox: mapRef.current, type: 'mapbox', utils }}>
      <div ref={divRef} style={{ height: props.height || '85vh', width: '100%' }} />
      { loaded ? props.children : null }
    </MapProvider>
  )
};

let loadedScript = false;
let loadedCss = false;

function MapBoxWrapper(props: MapComponentProps) {
  const { loadingComponent, mapBoxLoaderOptions } = props;

  const [loadingScript, setLoadingScript] = useState(! loadedScript);
  const [loadingCss, setLoadingCss] = useState(! loadedCss);

  const versionRef = useRef(mapBoxLoaderOptions ? mapBoxLoaderOptions.version : DEFAULT_MAPBOX_VERSION);

  const loadCss = useCallback(() => {
    if (loadedCss) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.onload = () => {
      setLoadingCss(false);
    };
    link.href = `https://api.mapbox.com/mapbox-gl-js/v${versionRef.current}/mapbox-gl.css`;
    document.head.appendChild(link);
  }, []);

  const loadScript = useCallback(() => {
    if (loadedScript) {
      return;
    }

    const script = document.createElement('script');
    script.onload = () => {
      setLoadingScript(false);
    };
    script.src = `https://api.mapbox.com/mapbox-gl-js/v${versionRef.current}/mapbox-gl.js`;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadScript();
    loadCss();
  }, [loadCss, loadScript]);

  if (loadingCss || loadingScript) {
    return loadingComponent ? loadingComponent : <div>Loading...</div>;
  }

  return <MapBox {...props} />;
};

export default MapBoxWrapper;
