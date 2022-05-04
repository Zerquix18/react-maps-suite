---
sidebar_position: 5
---

# Utils

React Maps Suite includes utility functions to make your life easier when displaying maps. These are separated into three groups: computation, checks and transformation. These functions rely on [Turf](https://turfjs.org/docs/). They work regardless of the provider you choose.

## Compute

### computeDistance

Calculates the distance in meters between two coordinates. You can specify a unit as a third parameter.

```typescript
const position1 = { lat: 16.810094992243155, lng: -70.31250253468735 };
const position2 = { lat: 24.051761600065085, lng: -70.4882837712763 };

const distance = computeDistance(position1, position2);

console.log(distance); // 805445.5982612824
```

### computeBearing

Calculates the bearing between two coordinates. This is an angle in degrees, between -180° and 180°, where 0° is the north pole.

```typescript
const position1 = { lat: 16.810094992243155, lng: -70.31250253468735 };
const position2 = { lat: 24.051761600065085, lng: -70.4882837712763 };

const bearing = computeBearing(position1, position2);

console.log(bearing); // -1.2731874057941126
```

### computeHeading

Alias for `computeBearing`.

### interpolate

Calculates the coordinates at a specific point between two coordinates, based on a percent.

```typescript
const position1 = { lat: 16.810094992243155, lng: -70.31250253468735 };
const position2 = { lat: 24.051761600065085, lng: -70.4882837712763 };

const position3 = interpolate(position1, position2, 0.5);

console.log(position3); // { lat: 20.43092829615412, lng: -70.40039315298182 }
```

## Checks

### isPointWithinBox

Returns true if a position is within a bounding box.

```typescript
import { MapBoundingBox } from 'react-maps-suite';

const boundingBox: MapBoundingBox = {
  ne: { lat: 20.20790069663606, lng: -67.78320319149644 },
  sw: { lat: 18.02818279373099, lng: -69.7827147576958 }
};
const position = { lat: 19.2686840709884, lng: -68.74389658300205 };

const result = isPointWithinBox(boundingBox, position);
console.log(result); // true
```

### isPointWithinRectangle

Returns true if a position is within a `MapRectangle`.

### isPointWithinCircle

Returns true if a position is within a `MapCircle`.

### isPointWithinPolygon

Returns true if a position is within a `MapPolygon`. 

## Transformation

### moveCircle
Returns a new `MapCircle` at the given coordinates.

### moveRectangle
Returns a new `MapRectangle` at the given coordinates.

### movePolygon
Returns a new `MapPolygon` at the given coordinates.

### movePolyline
Returns a new `MapPolyline` at the given coordinates.

### scaleCircle
Grows or shrinks a `MapCircle` by a percentage.
### scaleRectangle
Grows or shrinks a `MapRectangle` by a percentage.
### scalePolygon
Grows or shrinks a `MapPolygon` by a percentage.
### scalePolyline
Grows or shrinks a `MapPolyline` by a percentage.

### rotateRectangle
Rotates a `MapRectangle` by x degrees.

### rotatePolygon
Rotates a `MapPolygon` by x degrees.

### rotatePolyline
Rotates a `MapPolyline` by x degrees.
