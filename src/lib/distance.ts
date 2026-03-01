import type { GeoLocation } from '@/types/user';
import { SHIPPING_TIERS, WEIGHT_BASED_SHIPPING_RATE } from '@/types/pricing';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function calculateDistanceMiles(
  point1: GeoLocation,
  point2: GeoLocation
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function getShippingCost(
  distanceMiles: number,
  weightLbs: number = 1
): number {
  for (const tier of SHIPPING_TIERS) {
    if (distanceMiles >= tier.minMiles && distanceMiles < tier.maxMiles) {
      return tier.baseCost;
    }
  }
  // 100+ miles: last tier base + weight/distance surcharge
  const lastTier = SHIPPING_TIERS[SHIPPING_TIERS.length - 1];
  if (distanceMiles >= lastTier.maxMiles) {
    return Math.round(
      (lastTier.baseCost + (distanceMiles - lastTier.maxMiles) * WEIGHT_BASED_SHIPPING_RATE * weightLbs) * 100
    ) / 100;
  }
  return lastTier.baseCost;
}

export function formatDistance(miles: number): string {
  if (miles < 1) return '< 1 mi';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

// Common US zip code centroids for demo — in production use a geocoding API
export const ZIP_CODE_COORDS: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  '10001': { lat: 40.7484, lng: -73.9967, city: 'New York', state: 'NY' },
  '10010': { lat: 40.7390, lng: -73.9826, city: 'New York', state: 'NY' },
  '10013': { lat: 40.7209, lng: -74.0048, city: 'New York', state: 'NY' },
  '11201': { lat: 40.6934, lng: -73.9895, city: 'Brooklyn', state: 'NY' },
  '11211': { lat: 40.7128, lng: -73.9539, city: 'Brooklyn', state: 'NY' },
  '02101': { lat: 42.3601, lng: -71.0589, city: 'Boston', state: 'MA' },
  '02139': { lat: 42.3653, lng: -71.1039, city: 'Cambridge', state: 'MA' },
  '06510': { lat: 41.3083, lng: -72.9279, city: 'New Haven', state: 'CT' },
  '19103': { lat: 39.9526, lng: -75.1652, city: 'Philadelphia', state: 'PA' },
  '15213': { lat: 40.4443, lng: -79.9530, city: 'Pittsburgh', state: 'PA' },
  '20001': { lat: 38.9072, lng: -77.0369, city: 'Washington', state: 'DC' },
  '21201': { lat: 39.2904, lng: -76.6122, city: 'Baltimore', state: 'MD' },
  '23220': { lat: 37.5515, lng: -77.4764, city: 'Richmond', state: 'VA' },
  '27601': { lat: 35.7796, lng: -78.6382, city: 'Raleigh', state: 'NC' },
  '28202': { lat: 35.2271, lng: -80.8431, city: 'Charlotte', state: 'NC' },
  '30301': { lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
  '30303': { lat: 33.7527, lng: -84.3884, city: 'Atlanta', state: 'GA' },
  '32801': { lat: 28.5383, lng: -81.3792, city: 'Orlando', state: 'FL' },
  '33101': { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL' },
  '33602': { lat: 27.9506, lng: -82.4572, city: 'Tampa', state: 'FL' },
  '37201': { lat: 36.1627, lng: -86.7816, city: 'Nashville', state: 'TN' },
  '40202': { lat: 38.2527, lng: -85.7585, city: 'Louisville', state: 'KY' },
  '43215': { lat: 39.9612, lng: -83.0007, city: 'Columbus', state: 'OH' },
  '44101': { lat: 41.4993, lng: -81.6944, city: 'Cleveland', state: 'OH' },
  '46204': { lat: 39.7684, lng: -86.1581, city: 'Indianapolis', state: 'IN' },
  '48201': { lat: 42.3314, lng: -83.0458, city: 'Detroit', state: 'MI' },
  '48104': { lat: 42.2808, lng: -83.7430, city: 'Ann Arbor', state: 'MI' },
  '53202': { lat: 43.0389, lng: -87.9065, city: 'Milwaukee', state: 'WI' },
  '53703': { lat: 43.0731, lng: -89.4012, city: 'Madison', state: 'WI' },
  '55401': { lat: 44.9778, lng: -93.2650, city: 'Minneapolis', state: 'MN' },
  '60601': { lat: 41.8819, lng: -87.6278, city: 'Chicago', state: 'IL' },
  '60602': { lat: 41.8827, lng: -87.6286, city: 'Chicago', state: 'IL' },
  '60614': { lat: 41.9215, lng: -87.6513, city: 'Chicago', state: 'IL' },
  '63101': { lat: 38.6270, lng: -90.1994, city: 'St. Louis', state: 'MO' },
  '64101': { lat: 39.0997, lng: -94.5786, city: 'Kansas City', state: 'MO' },
  '68102': { lat: 41.2565, lng: -95.9345, city: 'Omaha', state: 'NE' },
  '70112': { lat: 29.9511, lng: -90.0715, city: 'New Orleans', state: 'LA' },
  '72201': { lat: 34.7465, lng: -92.2896, city: 'Little Rock', state: 'AR' },
  '73102': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City', state: 'OK' },
  '75201': { lat: 32.7767, lng: -96.7970, city: 'Dallas', state: 'TX' },
  '75202': { lat: 32.7830, lng: -96.7991, city: 'Dallas', state: 'TX' },
  '77001': { lat: 29.7604, lng: -95.3698, city: 'Houston', state: 'TX' },
  '78201': { lat: 29.4241, lng: -98.4936, city: 'San Antonio', state: 'TX' },
  '78701': { lat: 30.2672, lng: -97.7431, city: 'Austin', state: 'TX' },
  '78702': { lat: 30.2619, lng: -97.7223, city: 'Austin', state: 'TX' },
  '80201': { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO' },
  '80202': { lat: 39.7503, lng: -105.0003, city: 'Denver', state: 'CO' },
  '80302': { lat: 40.0150, lng: -105.2705, city: 'Boulder', state: 'CO' },
  '83702': { lat: 43.6187, lng: -116.2146, city: 'Boise', state: 'ID' },
  '84101': { lat: 40.7608, lng: -111.8910, city: 'Salt Lake City', state: 'UT' },
  '85001': { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ' },
  '85281': { lat: 33.4255, lng: -111.9400, city: 'Tempe', state: 'AZ' },
  '85701': { lat: 32.2226, lng: -110.9747, city: 'Tucson', state: 'AZ' },
  '87101': { lat: 35.0844, lng: -106.6504, city: 'Albuquerque', state: 'NM' },
  '89101': { lat: 36.1699, lng: -115.1398, city: 'Las Vegas', state: 'NV' },
  '89501': { lat: 39.5296, lng: -119.8138, city: 'Reno', state: 'NV' },
  '90001': { lat: 33.9425, lng: -118.2551, city: 'Los Angeles', state: 'CA' },
  '90012': { lat: 34.0597, lng: -118.2381, city: 'Los Angeles', state: 'CA' },
  '90210': { lat: 34.0901, lng: -118.4065, city: 'Beverly Hills', state: 'CA' },
  '90405': { lat: 34.0195, lng: -118.4912, city: 'Santa Monica', state: 'CA' },
  '91101': { lat: 34.1478, lng: -118.1445, city: 'Pasadena', state: 'CA' },
  '92101': { lat: 32.7157, lng: -117.1611, city: 'San Diego', state: 'CA' },
  '93101': { lat: 34.4208, lng: -119.6982, city: 'Santa Barbara', state: 'CA' },
  '94016': { lat: 37.6213, lng: -122.3790, city: 'Daly City', state: 'CA' },
  '94102': { lat: 37.7793, lng: -122.4193, city: 'San Francisco', state: 'CA' },
  '94103': { lat: 37.7726, lng: -122.4120, city: 'San Francisco', state: 'CA' },
  '94110': { lat: 37.7508, lng: -122.4155, city: 'San Francisco', state: 'CA' },
  '94301': { lat: 37.4419, lng: -122.1430, city: 'Palo Alto', state: 'CA' },
  '94560': { lat: 37.5297, lng: -122.0411, city: 'Newark', state: 'CA' },
  '94601': { lat: 37.7752, lng: -122.2162, city: 'Oakland', state: 'CA' },
  '95110': { lat: 37.3382, lng: -121.8863, city: 'San Jose', state: 'CA' },
  '95814': { lat: 38.5816, lng: -121.4944, city: 'Sacramento', state: 'CA' },
  '97201': { lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR' },
  '97210': { lat: 45.5320, lng: -122.7175, city: 'Portland', state: 'OR' },
  '97401': { lat: 44.0521, lng: -123.0868, city: 'Eugene', state: 'OR' },
  '98101': { lat: 47.6062, lng: -122.3321, city: 'Seattle', state: 'WA' },
  '98102': { lat: 47.6318, lng: -122.3215, city: 'Seattle', state: 'WA' },
  '98105': { lat: 47.6615, lng: -122.2940, city: 'Seattle', state: 'WA' },
  '98402': { lat: 47.2529, lng: -122.4443, city: 'Tacoma', state: 'WA' },
  '96801': { lat: 21.3069, lng: -157.8583, city: 'Honolulu', state: 'HI' },
  '99501': { lat: 61.2181, lng: -149.9003, city: 'Anchorage', state: 'AK' },
};

export function lookupZipCode(zip: string): GeoLocation | null {
  const entry = ZIP_CODE_COORDS[zip];
  if (!entry) return null;
  return {
    lat: entry.lat,
    lng: entry.lng,
    zipCode: zip,
    city: entry.city,
    state: entry.state,
  };
}
