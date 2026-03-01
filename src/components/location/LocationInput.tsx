'use client';

import { useState, useCallback } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { lookupZipCode } from '@/lib/distance';

export default function LocationInput() {
  const { location, isLocationLoading, setLocation, setLocationLoading } = useAppStore();
  const [zipInput, setZipInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    setLocationLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocationLoading(false);
        setError('Location access denied. Enter a zip code instead.');
      }
    );
  }, [setLocation, setLocationLoading]);

  const handleZipSubmit = useCallback(() => {
    const zip = zipInput.trim();
    if (!/^\d{5}$/.test(zip)) {
      setError('Enter a valid 5-digit US zip code');
      return;
    }
    const result = lookupZipCode(zip);
    if (result) {
      setLocation(result);
      setError(null);
    } else {
      // For zips not in our lookup, generate an approximate location
      // In production this would call a geocoding API
      setError('Zip code not in demo database. Try: 94102, 78701, 60601, 10001, etc.');
    }
  }, [zipInput, setLocation]);

  if (location) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm">
        <MapPin className="h-4 w-4 text-green-600" />
        <span className="text-green-800">
          {location.city && location.state
            ? `${location.city}, ${location.state}`
            : `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`}
        </span>
        <button
          onClick={() => { setLocation(null as never); setZipInput(''); }}
          className="ml-auto text-xs text-green-600 hover:text-green-800"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Your Location
      </label>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGeolocation}
          disabled={isLocationLoading}
          className="gap-1.5 w-full"
        >
          {isLocationLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Navigation className="h-3.5 w-3.5" />
          )}
          Use My Location
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="flex gap-1.5">
          <Input
            type="text"
            placeholder="Zip code"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleZipSubmit()}
            maxLength={5}
            className="flex-1 min-w-0"
          />
          <Button size="sm" variant="secondary" onClick={handleZipSubmit}>
            Go
          </Button>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
