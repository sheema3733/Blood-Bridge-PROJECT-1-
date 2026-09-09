import { describe, it, expect } from 'vitest';
import { calculateDistanceKm } from './geoDistance';

describe('Geo Haversine Distance Calculator', () => {
  it('should return 0 km for identical coordinates', () => {
    const lat = 28.6139;
    const lon = 77.2090;
    expect(calculateDistanceKm(lat, lon, lat, lon)).toBe(0);
  });

  it('should accurately calculate distance between known points', () => {
    // New Delhi (28.6139, 77.2090) to Connaught Place (~28.6315, 77.2167) ~2.1 km
    const dist = calculateDistanceKm(28.6139, 77.2090, 28.6315, 77.2167);
    expect(dist).toBeGreaterThan(1.5);
    expect(dist).toBeLessThan(3.0);
  });

  it('should be symmetric regardless of point order', () => {
    const p1 = { lat: 28.6139, lon: 77.2090 };
    const p2 = { lat: 28.6500, lon: 77.1900 };

    const d1 = calculateDistanceKm(p1.lat, p1.lon, p2.lat, p2.lon);
    const d2 = calculateDistanceKm(p2.lat, p2.lon, p1.lat, p1.lon);
    expect(d1).toEqual(d2);
  });
});
