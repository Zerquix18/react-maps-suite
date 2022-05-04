import * as turf from '@turf/turf';
import transformTranslate from '@turf/transform-translate';
import transformScale from '@turf/transform-scale';
import transformRotate from '@turf/transform-rotate';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { MapBoundingBox, MapCircle, MapLatLng, MapPolygon, MapPolyline, MapRectangle } from '../models';

/************************************** COMPUTE ******************************************/

/**
 * Returns the distance between to coordinates.
 */
export function computeDistance(position1: MapLatLng, position2: MapLatLng, units: turf.Units = 'meters') {
  const { lat: lat1, lng: lng1 } = position1;
  const { lat: lat2, lng: lng2 } = position2;

  const point1 = turf.point([lng1, lat1]);
  const point2 = turf.point([lng2, lat2]);
  
  return turf.distance(point1, point2, { units });
}

/**
 * Returns the bearing, heading or angle at which the straight line between `position1` and `position2` are pointing at.
 */
export function computeBearing(position1: MapLatLng, position2: MapLatLng) {
  const { lat: lat1, lng: lng1 } = position1;
  const { lat: lat2, lng: lng2 } = position2;

  const point1 = turf.point([lng1, lat1]);
  const point2 = turf.point([lng2, lat2]);
  
  return turf.bearing(point1, point2);
}

/**
 * Alias for `getBearing`.
 */
export function computeHeading(position1: MapLatLng, position2: MapLatLng) {
  return computeBearing(position1, position2);
}

/**
 * Returns the coordinates for a point between `position1` and `position2` for the given `percent`.
 */
export function interpolate(position1: MapLatLng, position2: MapLatLng, percent: number) {
  const lat = position1.lat + (position2.lat - position1.lat) * percent;
  const lng = position1.lng + (position2.lng - position1.lng) * percent;
  return { lat, lng };
}

/************************************** CHECKS ******************************************/

/**
 * Checks whether a point is in inside a bounding box.
 */
export function isPointWithinBox(box: MapBoundingBox, position: MapLatLng) {
  const isLngInRange = position.lng >= box.sw.lng && position.lng <= box.ne.lng
  const isLatInRange = position.lat >= box.sw.lat && position.lat <= box.ne.lat;

  return isLngInRange && isLatInRange;
}

export function isPointWithinRectangle(rectangle: MapRectangle, position: MapLatLng) {
  return isPointWithinBox(rectangle.bounds, position);
}

export function isPointWithinCircle(circle: MapCircle, position: MapLatLng) {
  return computeDistance(circle.position, position) < circle.radius;
}

export function isPointWithinPolygon(polygon: MapPolygon, position: MapLatLng) {
  const path = polygon.path.map(position => {
    const { lat, lng } = position;
    return [lat, lng];
  });

  path.push(path[0]); // google auto-closes polygons

  const turfPolygon = turf.polygon([path]);
  const point = turf.point([position.lng, position.lat]);
  return booleanPointInPolygon(point, turfPolygon);
}

/************************************** TRANSFORMS ******************************************/

export function moveCircle(circle: MapCircle, position: MapLatLng): MapCircle {
  return { ...circle, position };
}

export function moveRectangle(rectangle: MapRectangle, position: MapLatLng): MapRectangle {
  const turfRectangle = turf.bboxPolygon([
    rectangle.bounds.sw.lng,
    rectangle.bounds.sw.lat,
    rectangle.bounds.ne.lng,
    rectangle.bounds.ne.lat,
  ]);

  const centroid = turf.centroid(turfRectangle);

  const from = turf.point([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]]);
  const to = turf.point([position.lng, position.lat]);
  const distance = turf.distance(from, to);
  const bearing = turf.bearing(from, to);

  const translatedRectangle = transformTranslate(turfRectangle, distance, bearing);
  const coordinates = translatedRectangle.geometry.coordinates[0];
  
  const bounds = {
    ne: {
      lat: coordinates[1][1],
      lng: coordinates[1][0],
    },
    sw: {
      lat: coordinates[3][1],
      lng: coordinates[3][0],
    },
  };

  return { ...rectangle, bounds };
}

export function movePolygon(polygon: MapPolygon, position: MapLatLng): MapPolygon {
  const path = polygon.path.map(position => [position.lng, position.lat]);
  path.push(path[0]); // google autocloses polygons.

  const turfPolygon = turf.polygon([path]);
  const centroid = turf.centroid(turfPolygon);

  const from = turf.point([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]]);
  const to = turf.point([position.lng, position.lat]);

  const distance = turf.distance(from, to);
  const bearing = turf.bearing(from, to);

  const translatedPoly = transformTranslate(turfPolygon, distance, bearing);
  const newPath = translatedPoly.geometry.coordinates[0].map(coordinate => ({ lng: coordinate[0], lat: coordinate[1] }));

  return { ...polygon, path: newPath };
}

export function movePolyline(polyline: MapPolyline, position: MapLatLng): MapPolyline {
  const path = polyline.path.map(position => [position.lat, position.lng]);
  const turfLine = turf.lineString(path);

  const centroid = turf.centroid(turfLine);

  const from = turf.point([centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]]);
  const to = turf.point([position.lat, position.lng]);
  const distance = turf.distance(from, to);
  const bearing = turf.bearing(from, to);

  const translatedPoly = transformTranslate(turfLine, distance, bearing);
  const newPath = translatedPoly.geometry.coordinates.map(coordinate => ({ lat: coordinate[0], lng: coordinate[1] }));
  
  return { ...polyline, path: newPath };
}

export function scaleCircle(circle: MapCircle, factor: number): MapCircle {
  const radius = circle.radius * factor;
  return { ...circle, radius };
}

export function scaleRectangle(rectangle: MapRectangle, factor: number): MapRectangle {
  const turfLine = turf.lineString([
    [rectangle.bounds.sw.lng, rectangle.bounds.sw.lat],
    [rectangle.bounds.ne.lng, rectangle.bounds.ne.lat]
  ]);

  const turfBbox = turf.bbox(turfLine);
  const turfRectangle = turf.bboxPolygon(turfBbox);

  const translatedPoly = transformScale(turfRectangle, factor);

  const coordinates = translatedPoly.geometry.coordinates[0]!;

  const bounds = {
    ne: {
      lat: coordinates[1][1],
      lng: coordinates[1][0],
    },
    sw: {
      lat: coordinates[3][1],
      lng: coordinates[3][0],
    },
  };

  return { ...rectangle, bounds };
}

export function scalePolygon(polygon: MapPolygon, factor: number): MapPolygon {
  const path = polygon.path.map(position => [position.lng, position.lat]);
  path.push(path[0]); // google autocloses polygons.

  const turfPolygon = turf.polygon([path]);

  const translatedPoly = transformScale(turfPolygon, factor);
  const newPath = translatedPoly.geometry.coordinates[0].map(coordinate => ({ lng: coordinate[0], lat: coordinate[1] }));

  return { ...polygon, path: newPath };
}

export function scalePolyline(polyline: MapPolyline, factor: number): MapPolyline {
  const path = polyline.path.map(position => [position.lng, position.lat]);
  const turfLine = turf.lineString(path);

  const translatedPoly = transformScale(turfLine, factor);
  const newPath = translatedPoly.geometry.coordinates.map(coordinate => ({ lng: coordinate[0], lat: coordinate[1] }));
  
  return { ...polyline, path: newPath };
}


export function rotateRectangle(rectangle: MapRectangle, degrees: number): MapRectangle {
  const turfRectangle = turf.bboxPolygon([
    rectangle.bounds.sw.lng,
    rectangle.bounds.sw.lat,
    rectangle.bounds.ne.lng,
    rectangle.bounds.ne.lat,
  ]);

  const translatedPoly = transformRotate(turfRectangle, degrees);
  const coordinates = translatedPoly.geometry.coordinates[0];

  const bounds = {
    ne: {
      lat: coordinates[1][1],
      lng: coordinates[1][0],
    },
    sw: {
      lat: coordinates[3][1],
      lng: coordinates[3][0],
    },
  };

  return { ...rectangle, bounds };
}

export function rotatePolygon(polygon: MapPolygon, degrees: number): MapPolygon {
  const path = polygon.path.map(position => [position.lng, position.lat]);
  path.push(path[0]); // google autocloses polygons.

  const turfPolygon = turf.polygon([path]);

  const translatedPoly = transformRotate(turfPolygon, degrees);
  const newPath = translatedPoly.geometry.coordinates[0].map(coordinate => ({ lng: coordinate[0], lat: coordinate[1] }));
  
  return { ...polygon, path: newPath };
}

export function rotatePolyline(polyline: MapPolyline, degrees: number): MapPolyline {
  const path = polyline.path.map(position => [position.lng, position.lat]);
  const turfLine = turf.lineString(path);

  const translatedPoly = transformRotate(turfLine, degrees);
  const newPath = translatedPoly.geometry.coordinates.map(coordinate => ({ lng: coordinate[0], lat: coordinate[1] }));
  return { ...polyline, path: newPath };
}
