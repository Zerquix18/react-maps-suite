import { useEffect, useRef } from 'react';
import type L from 'leaflet';
import uniqid from 'uniqid';

import { useMap } from '../../../hooks';
declare var window: any;

type GetLayer = (url: string) => Promise<string>;

interface OfflineLayerProps {
  url: string;
  options?: L.TileLayerOptions;
  getTileUrl: GetLayer;
}

function OfflineLayer(props: OfflineLayerProps) {
  const { leaflet } = useMap();

  const defaults = useRef(props);

  useEffect(() => {
    if (! leaflet) {
      return;
    }

    // thanks to https://github.com/robertomlsoares/leaflet-offline/blob/master/src/TileLayer.Offline.js
    // placed within this useEffect because otherwise window.L isn't loaded 

    const OfflineTileLayer = window.L.TileLayer.extend({
      initialize: function (url: string, getTileUrl: GetLayer, options?: L.TileLayerOptions) {
        this._url = url;
        this._getTileUrl = getTileUrl;

        options = window.L.Util.setOptions(this, options) as L.TileLayerOptions;

        if (options.detectRetina && window.L.Browser.retina && options.maxZoom && options.maxZoom > 0) {
          options.tileSize = Math.floor(options.tileSize as number / 2);

          if (! options.zoomReverse) {
            options.zoomOffset!++;
            options.maxZoom--;
          } else {
            options.zoomOffset!--;
            options.minZoom!++;
          }

          options.minZoom = Math.max(0, options.minZoom!);
        }

        if (typeof options.subdomains === 'string') {
            options.subdomains = options.subdomains.split('');
        }

        if (! window.L.Browser.android) {
          this.on('tileunload', this._onTileRemove);
        }
      },

      createTile: function (coords: L.Coords, done: () => void) {
        const tile = document.createElement('img');

        window.L.DomEvent.on(tile, 'load', window.L.Util.bind(this._tileOnLoad, this, done, tile));
        window.L.DomEvent.on(tile, 'error', window.L.Util.bind(this._tileOnError, this, done, tile));

        if (this.options.crossOrigin) {
          tile.crossOrigin = '';
        }

        tile.alt = '';

        tile.setAttribute('role', 'presentation');

        this.getTileUrl(coords).then((url: string) => {
          tile.src = url;
        }).catch((err: Error) => {
          throw err;
        });

        return tile;
      },

      getTileUrl: function (coords: L.Coords) {
        const url = window.L.TileLayer.prototype.getTileUrl.call(this, coords);

        return this._getTileUrl(url);
      },

      getTileUrls: function (bounds: L.Bounds, zoom: number) {
        const tiles = [];
        const originalurl = this._url;

        this.setUrl(this._url.replace('{z}', zoom), true);

        const tileBounds = window.L.bounds(
          bounds.min!.divideBy(this.getTileSize().x).floor(),
          bounds.max!.divideBy(this.getTileSize().x).floor()
        );

        for (let i = tileBounds.min!.x; i <= tileBounds.max!.x; i++) {
          for (let j = tileBounds.min!.y; j <= tileBounds.max!.y; j++) {
            const tilePoint = new window.L.Point(i, j);
            const url = window.L.TileLayer.prototype.getTileUrl.call(this, tilePoint);

            tiles.push({ key: url, url });
          }
        }

        this.setUrl(originalurl, true);

        return tiles;
      },
    });

    window.L.TileLayer['Offline'] = OfflineTileLayer;
    window.L.tileLayer['offline'] = function (url: string, getTileUrl: GetLayer, options?: L.TileLayerOptions) {
      return new window.L.TileLayer['Offline'](url, getTileUrl, options);
    };

    const id = uniqid();
    const { url, getTileUrl, options } = defaults.current;

    const layerId = 'leaflet-offline-' + id;
    window[layerId] = window.L.tileLayer['offline'](url, getTileUrl, options).addTo(leaflet);
    window.leaflet = leaflet;

    return () => {
      leaflet.removeLayer(window[layerId]);
      window[layerId] = undefined;
    };

  }, [leaflet]);

  return null;
};

export default OfflineLayer;
