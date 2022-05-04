import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

import { MapBoundingBox, MapComponentProps, MapLatLng } from '../../models';
import { MapProvider } from '../../context';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../constants';

function GoogleMap(props: MapComponentProps) {
  const defaultCenter = props.defaultCenter || props.center || DEFAULT_CENTER;
  const defaultZoom = props.defaultZoom || props.zoom || DEFAULT_ZOOM;

  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapOverlayRef = useRef<google.maps.OverlayView | null>(null);

  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [loaded, setLoaded] = useState(false);

  const { onZoomChange, onCenterChange, onClick, onRightClick } = props;

  const onZoomChangeListener = useCallback(() => {
    if (! mapRef.current) {
      return;
    }

    const zoom = mapRef.current.getZoom();
    if (typeof zoom === 'undefined') {
      return;
    }

    setZoom(zoom);
    if (onZoomChange) {
      onZoomChange({ zoom });
    }
  }, [onZoomChange]);

  const onCenterChangeListener = useCallback(() => {
    if (! mapRef.current) {
      return;
    }

    const center = mapRef.current.getCenter();
    if (! center) {
      return;
    }

    const lat = center.lat();
    const lng = center.lng();
    const position = { lat, lng };

    setCenter(position);

    if (onCenterChange) {
      onCenterChange({ position });
    }
  }, [onCenterChange]);

  const onClickListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! mapRef.current) {
      return;
    }

    if (! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const position = { lat, lng };

    if (onClick) {
      onClick({ position });
    }
  }, [onClick]);

  const onRightClickListener = useCallback((event: google.maps.MapMouseEvent) => {
    if (! mapRef.current) {
      return;
    }

    if (! event.latLng) {
      return;
    }

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const position = { lat, lng };

    if (onRightClick) {
      onRightClick({ position });
    }
  }, [onRightClick]);

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

    const googleBounds = new google.maps.LatLngBounds(bounds.ne, bounds.sw);
    mapRef.current.panToBounds(googleBounds);
  }, []);

  const fitToPath = useCallback((path: MapLatLng[]) => {
    if (! mapRef.current) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    path.forEach(position => {
      const { lat, lng } = position;
      const latLng = new google.maps.LatLng(lat, lng);

      bounds.extend(latLng);
    });

    mapRef.current.fitBounds(bounds);
  }, []);

  const getElement = useCallback(() => divRef.current, []);

  const unproject = useCallback((x: number, y: number) => {
    if (! mapOverlayRef.current) {
      throw new Error('Cannot project with unloaded map.');
    }
    const point = new google.maps.Point(x, y);
    const coordinates = mapOverlayRef.current.getProjection().fromContainerPixelToLatLng(point);
    if (! coordinates) {
      return { lat: 0, lng: 0 };
    }

    const lat = coordinates.lat();
    const lng = coordinates.lng();
    return { lat, lng };
  }, []);

  const utils = useMemo(() => ({
    animateTo,
    animateToBounds,
    fitToPath,
    getElement,
    unproject,
  }), [animateTo, animateToBounds, fitToPath, getElement, unproject]);

  // useEffect should not clean up upon changing these.
  const defaultCenterRef = useRef(defaultCenter);
  const defaultZoomRef = useRef(defaultZoom);
  const defaultOptionsRef = useRef(props.googleOptions);
  const onMapLoadRef = useRef(props.onMapLoad);

  useEffect(() => {
    if (! divRef.current) {
      return;
    }
    
    mapRef.current = new google.maps.Map(divRef.current, {
      center: defaultCenterRef.current,
      zoom: defaultZoomRef.current,
      fullscreenControl: true,
      streetViewControl: false,
      scaleControl: true,
      scrollwheel: true,
      mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      ...defaultOptionsRef.current,
    });

    setLoaded(true); // triggers a re-render now that we have the ref.

    if (onMapLoadRef.current) {
      onMapLoadRef.current({ googleMap: mapRef.current, utils });
    }

    mapOverlayRef.current = new google.maps.OverlayView();
    mapOverlayRef.current.draw = () => {};
    mapOverlayRef.current.setMap(mapRef.current);
  }, []);

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
      
    const listener = mapRef.current.addListener('zoom_changed', onZoomChangeListener);
    return () => {
      if (mapRef.current) {
        listener.remove();
      }
    };
  }, [onZoomChangeListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }
      
    const listener = mapRef.current.addListener('center_changed', onCenterChangeListener);
    return () => {
      if (mapRef.current) {
        listener.remove();
      }
    };
  }, [onCenterChangeListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }
      
    const listener = mapRef.current.addListener('click', onClickListener);
    return () => {
      if (mapRef.current) {
        listener.remove();
      }
    };
  }, [onClickListener]);

  useEffect(() => {
    if (! mapRef.current) {
      return;
    }
      
    const listener = mapRef.current.addListener('rightclick', onRightClickListener);
    return () => {
      if (mapRef.current) {
        listener.remove();
      }
    };
  }, [onRightClickListener]);

  return (
    <MapProvider map={{ center, zoom, googleMap: mapRef.current, type: 'google', utils }}>
      <div ref={divRef} style={{ height: props.height || '85vh', width: '100%' }} />
      { loaded ? props.children : null }
    </MapProvider>
  );
};

function GoogleMapWrapper(props: MapComponentProps) {
  const { loadingComponent, googleLoaderOptions } = props;
  const [loading, setLoading] = useState(true);

  const loaderOptionsRef = useRef(googleLoaderOptions);

  useEffect(() => {
    const loader = new Loader(loaderOptionsRef.current || { apiKey: '' });

    loader.load().then(() => {
      setLoading(false);
    });

    return () => {
      setLoading(true);
    };
  }, []);

  if (loading) {
    return loadingComponent ? loadingComponent : <div>Loading...</div>;
  }

  return <GoogleMap {...props} />;
}

export default GoogleMapWrapper;
