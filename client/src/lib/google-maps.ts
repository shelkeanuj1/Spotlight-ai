/* eslint-disable @typescript-eslint/no-explicit-any */
// Google Maps JavaScript API Integration
// Requires: VITE_GOOGLE_MAPS_API_KEY in .env

// Use any to bypass strict typing - Google Maps is loaded at runtime
declare global {
  interface Window {
    google: any;
  }
}

const VITE_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const VITE_GOOGLE_PLACES_API_KEY =
  import.meta.env.VITE_GOOGLE_PLACES_API_KEY || VITE_GOOGLE_MAPS_API_KEY;
const VITE_GOOGLE_DIRECTIONS_API_KEY =
  import.meta.env.VITE_GOOGLE_DIRECTIONS_API_KEY || VITE_GOOGLE_MAPS_API_KEY;
const VITE_GOOGLE_GEOCODING_API_KEY =
  import.meta.env.VITE_GOOGLE_GEOCODING_API_KEY || VITE_GOOGLE_MAPS_API_KEY;

let mapsLoaded = false;
let mapsLoadPromise: Promise<void> | null = null;

// Load Google Maps SDK
export function loadGoogleMaps(): Promise<void> {
  if (mapsLoaded) return Promise.resolve();
  if (mapsLoadPromise) return mapsLoadPromise;

  mapsLoadPromise = new Promise((resolve, reject) => {
    if (!VITE_GOOGLE_MAPS_API_KEY) {
      console.warn("⚠️ Google Maps API key not configured");
      resolve();
      return;
    }

    // Check if already loaded
    if (window.google?.maps) {
      mapsLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${VITE_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      mapsLoaded = true;
      console.log("✅ Google Maps loaded");
      resolve();
    };

    script.onerror = () => {
      console.error("❌ Failed to load Google Maps");
      reject(new Error("Google Maps failed to load"));
    };

    document.head.appendChild(script);
  });

  return mapsLoadPromise;
}

// Check if Google Maps is loaded
export function isGoogleMapsLoaded(): boolean {
  return mapsLoaded && !!window.google?.maps;
}

// Get Google Maps instance
export function getGoogleMaps() {
  if (!isGoogleMapsLoaded()) {
    throw new Error("Google Maps not loaded");
  }
  return window.google.maps;
}

// Create Google Maps Map instance
export function createGoogleMap(
  element: HTMLElement,
  options: { center?: { lat: number; lng: number }; zoom?: number; [key: string]: any }
) {
  return new window.google.maps.Map(element, {
    center: { lat: 19.076, lng: 72.8777 },
    zoom: 14,
    ...options,
  });
}

// Create marker with custom icon
export function createGoogleMarker(
  position: { lat: number; lng: number },
  options?: { [key: string]: any }
) {
  return new window.google.maps.Marker({
    position,
    map: undefined,
    ...options,
  });
}

// Create info window
export function createInfoWindow(content: string) {
  return new window.google.maps.InfoWindow({ content });
}

// Calculate route between two points
export async function getRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<any | null> {
  if (!VITE_GOOGLE_DIRECTIONS_API_KEY || !isGoogleMapsLoaded()) return null;

  const directionsService = new window.google.maps.DirectionsService();

  try {
    const result = await directionsService.route({
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    return result;
  } catch (error) {
    console.error("❌ Directions error:", error);
    return null;
  }
}

// Geocode address to coordinates
export async function geocodeAddress(
  address: string
): Promise<any | null> {
  if (!VITE_GOOGLE_GEOCODING_API_KEY || !isGoogleMapsLoaded()) return null;

  const geocoder = new window.google.maps.Geocoder();

  try {
    const result = await geocoder.geocode({ address });
    return result;
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    return null;
  }
}

// Search nearby places (parking, EV stations)
export async function searchNearbyPlaces(
  location: { lat: number; lng: number },
  radius: number,
  type: "parking" | "electric_car_charging_station"
): Promise<any[]> {
  if (!VITE_GOOGLE_PLACES_API_KEY) return [];

  const request = {
    location,
    radius,
    type,
  };

  const service = new window.google.maps.places.PlacesService(
    document.createElement("div")
  );

  return new Promise((resolve) => {
    service.nearbySearch(request, (results: any, status: string) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        resolve(results);
      } else {
        resolve([]);
      }
    });
  });
}

// Get place details
export async function getPlaceDetails(
  placeId: string
): Promise<any | null> {
  if (!VITE_GOOGLE_PLACES_API_KEY) return null;

  const service = new window.google.maps.places.PlacesService(
    document.createElement("div")
  );

  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "opening_hours",
          "rating",
          "user_ratings_total",
          "price_level",
          "photos",
        ],
      },
      (place: any, status: string) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          resolve(place);
        } else {
          resolve(null);
        }
      }
    );
  });
}

// Export API keys configuration
export const googleMapsConfig = {
  mapsApiKey: VITE_GOOGLE_MAPS_API_KEY,
  placesApiKey: VITE_GOOGLE_PLACES_API_KEY,
  directionsApiKey: VITE_GOOGLE_DIRECTIONS_API_KEY,
  geocodingApiKey: VITE_GOOGLE_GEOCODING_API_KEY,
  isConfigured: !!VITE_GOOGLE_MAPS_API_KEY,
};

export default {
  loadGoogleMaps,
  isGoogleMapsLoaded,
  getGoogleMaps,
  createGoogleMap,
  createGoogleMarker,
  createInfoWindow,
  getRoute,
  geocodeAddress,
  searchNearbyPlaces,
  getPlaceDetails,
  googleMapsConfig,
};
