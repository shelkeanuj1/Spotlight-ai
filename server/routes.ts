import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import authRoutes from "./routes/auth";
import {
  searchGooglePlaces,
  convertToParkingPrediction,
  geocodeGoogleAddress,
  getGoogleDirections,
} from "./google-places";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ✅ AUTH ROUTES
  app.use("/api/auth", authRoutes);

  // ================= GOOGLE PLACES SEARCH =================
  app.get("/api/google/places", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseInt(req.query.radius as string) : 5000;
      const type = (req.query.type as string) || "parking";

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const places = await searchGooglePlaces(lat, lng, radius, type as "parking" | "electric_car_charging_station");
      
      const predictions = places.map(place => convertToParkingPrediction(place, lat, lng));
      
      res.json({ places: predictions });
    } catch (err) {
      console.error("❌ Google Places error:", err);
      res.status(500).json({ message: "Failed to fetch places" });
    }
  });

  app.get("/api/google/geocode", async (req, res) => {
    try {
      const address = (req.query.address as string) || "";
      if (!address.trim()) {
        return res.status(400).json({ message: "Address is required" });
      }

      const location = await geocodeGoogleAddress(address);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }

      res.json({ location });
    } catch (err) {
      console.error("❌ Google Geocoding error:", err);
      res.status(500).json({ message: "Failed to geocode address" });
    }
  });

  app.get("/api/google/directions", async (req, res) => {
    try {
      const originLat = parseFloat(req.query.originLat as string);
      const originLng = parseFloat(req.query.originLng as string);
      const destinationLat = parseFloat(req.query.destinationLat as string);
      const destinationLng = parseFloat(req.query.destinationLng as string);

      if (
        [originLat, originLng, destinationLat, destinationLng].some((val) =>
          Number.isNaN(val)
        )
      ) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      const route = await getGoogleDirections(
        { lat: originLat, lng: originLng },
        { lat: destinationLat, lng: destinationLng }
      );

      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }

      res.json({ route });
    } catch (err) {
      console.error("❌ Google Directions error:", err);
      res.status(500).json({ message: "Failed to fetch directions" });
    }
  });


  // ================= PARKING SEARCH =================
app.get(api.parking.search.path, async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius ? parseInt(req.query.radius as string) : 20000;
    const query = req.query.query as string;

    console.log("📡 API Search:", { lat, lng, radius });

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    if (query) {
      await storage.logSearch({ query, cityId: 1 });
    }

    const spots = await storage.getPredictions(lat, lng, radius);

    const bestSpot = spots[0];
    const avgScore =
      spots.length > 0
        ? spots.reduce((acc, s) => acc + s.score, 0) / spots.length
        : 0;

    res.json({
      spots,
      insights: {
        bestSpotId: bestSpot?.id || 0,
        summary: `Found ${spots.length} parking spots near your destination. Traffic is ${bestSpot?.trafficDensity || "Moderate"}.`,
        averageProbability: Math.round(avgScore),
      },
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

  // ================= SEARCH HISTORY (OPTIONAL) =================
  app.get(api.parking.history.path, async (req, res) => {
  try {
    const [rows]: any = await storage["db"].query(`
      SELECT 
        s.id,
        s.query,
        c.name AS city,
        s.created_at
      FROM searches s
      LEFT JOIN cities c ON s.city_id = c.id
      ORDER BY s.created_at DESC
      LIMIT 50
    `);

    res.json(rows);
  } catch (err) {
    console.error("History API error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});


  // ================= GET CITIES =================
  app.get(api.parking.cities.path, async (req, res) => {
    const citiesList = await storage.getCities();
    res.json(citiesList);
  });

  // ================= GET EV STATIONS =================
  app.get(api.parking.evStations.path, async (req, res) => {
    const cityId = parseInt(req.query.cityId as string) || 1;
    const stations = await storage.getEvStationsByCity(cityId);
    res.json(stations);
  });

  // ================= CREATE REPORT =================
  app.post(api.parking.reports.path, async (req, res) => {
    const report = await storage.createReport(req.body);
    res.status(201).json(report);
  });

  // ================= SEED DATABASE (RUN ONCE) =================
  async function seed() {
    const existingCities = await storage.getCities();

    if (existingCities.length === 0) {
      console.log("🌱 Seeding database...");

      const pune = await storage.createCity({
        name: "Pune",
        state: "Maharashtra",
      });

      const mumbai = await storage.createCity({
        name: "Mumbai",
        state: "Maharashtra",
      });

      // ✅ Add EV Stations (MySQL format)
      await storage.createEvStation({
        name: "Pune Fast Charger",
        lat: 18.5204,
        lng: 73.8567,
        power_kw: 50,
        status: "Available",
        cityId: pune.id,
      });

      await storage.createEvStation({
        name: "Mumbai EV Hub",
        lat: 19.0760,
        lng: 72.8777,
        power_kw: 60,
        status: "Available",
        cityId: mumbai.id,
      });

      console.log("✅ Database seeded successfully!");
    }
  }

  seed().catch(console.error);

  return httpServer;
}
