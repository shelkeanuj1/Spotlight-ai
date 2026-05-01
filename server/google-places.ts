// Google Maps Platform server integration.
// You can set a single GOOGLE_MAPS_API_KEY or separate service keys.
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || GOOGLE_MAPS_API_KEY;
const GOOGLE_DIRECTIONS_API_KEY =
  process.env.GOOGLE_DIRECTIONS_API_KEY || GOOGLE_MAPS_API_KEY || GOOGLE_PLACES_API_KEY;
const GOOGLE_GEOCODING_API_KEY =
  process.env.GOOGLE_GEOCODING_API_KEY ||
  GOOGLE_MAPS_API_KEY ||
  GOOGLE_PLACES_API_KEY ||
  GOOGLE_DIRECTIONS_API_KEY;

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  price_level?: number;
  types?: string[];
}

export interface GeocodingLocation {
  lat: number;
  lng: number;
}

// Search nearby places using Google Places API
export async function searchGooglePlaces(
  lat: number,
  lng: number,
  radius: number = 5000,
  type: "parking" | "electric_car_charging_station" = "parking"
): Promise<GooglePlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("⚠️ Google Places API key not configured");
    return [];
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", radius.toString());
  url.searchParams.set("type", type);
  url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK" && data.results) {
      return data.results as GooglePlaceResult[];
    }

    console.warn("⚠️ Google Places API status:", data.status);
    return [];
  } catch (error) {
    console.error("❌ Google Places API error:", error);
    return [];
  }
}

// Get place details
export async function getGooglePlaceDetails(
  placeId: string
): Promise<GooglePlaceResult | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,formatted_address,geometry,rating,user_ratings_total,opening_hours,price_level,types");
  url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK" && data.result) {
      return data.result as GooglePlaceResult;
    }

    return null;
  } catch (error) {
    console.error("❌ Google Places Details error:", error);
    return null;
  }
}

// Text search for parking
export async function textSearchParking(
  query: string,
  lat?: number,
  lng?: number
): Promise<GooglePlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) return [];

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", query + " parking");
  url.searchParams.set("type", "parking");
  url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

  if (lat && lng) {
    url.searchParams.set("location", `${lat},${lng}`);
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK" && data.results) {
      return data.results as GooglePlaceResult[];
    }

    return [];
  } catch (error) {
    console.error("❌ Text search error:", error);
    return [];
  }
}

// Get directions between two points
export async function getGoogleDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<any | null> {
  if (!GOOGLE_DIRECTIONS_API_KEY) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
  url.searchParams.set("destination", `${destination.lat},${destination.lng}`);
  url.searchParams.set("mode", "driving");
  url.searchParams.set("key", GOOGLE_DIRECTIONS_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "OK" && data.routes && data.routes[0]) {
      return data.routes[0];
    }

    return null;
  } catch (error) {
    console.error("❌ Directions API error:", error);
    return null;
  }
}

// Geocode a text address into coordinates.
export async function geocodeGoogleAddress(
  address: string
): Promise<GeocodingLocation | null> {
  if (!GOOGLE_GEOCODING_API_KEY) return null;

  const trimmedAddress = address.trim();
  if (!trimmedAddress) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", trimmedAddress);
  url.searchParams.set("key", GOOGLE_GEOCODING_API_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (
      data.status === "OK" &&
      Array.isArray(data.results) &&
      data.results[0]?.geometry?.location
    ) {
      return data.results[0].geometry.location as GeocodingLocation;
    }

    console.warn("⚠️ Google Geocoding API status:", data.status);
    return null;
  } catch (error) {
    console.error("❌ Geocoding API error:", error);
    return null;
  }
}

// Convert Google Place to ParkingPrediction format
export function convertToParkingPrediction(
  place: GooglePlaceResult,
  userLat: number,
  userLng: number
) {
  const placeLat = place.geometry.location.lat;
  const placeLng = place.geometry.location.lng;

  // Calculate distance (Haversine formula)
  const R = 6371; // Earth's radius in km
  const dLat = ((placeLat - userLat) * Math.PI) / 180;
  const dLng = ((placeLng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((placeLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Estimate walking time (5 km/h)
  const walkingTime = Math.round((distance / 5) * 60);

  return {
    id: parseInt(place.place_id.replace(/\D/g, "").slice(0, 8)) || Math.floor(Math.random() * 10000),
    name: place.name,
    location: { lat: placeLat, lng: placeLng },
    probability: "Medium" as const, // Default - we'd need real-time data
    score: Math.floor(Math.random() * 40) + 60, // Random 60-100
    availableSpaces: Math.floor(Math.random() * 5) + 1,
    trafficDensity: "Moderate" as const,
    legalStatus: "Legal",
    distance: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
    walkingTime: walkingTime < 60 ? `${walkingTime}min` : `${Math.round(walkingTime / 60)}h ${walkingTime % 60}min`,
  };
}

export default {
  searchGooglePlaces,
  getGooglePlaceDetails,
  textSearchParking,
  getGoogleDirections,
  geocodeGoogleAddress,
  convertToParkingPrediction,
};
