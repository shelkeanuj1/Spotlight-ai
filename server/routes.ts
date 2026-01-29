import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.parking.search.path, async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseInt(req.query.radius as string) : 500;
      const query = req.query.query as string;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      if (query) {
        await storage.logSearch({
          query,
          latitude: String(lat),
          longitude: String(lng)
        });
      }

      const spots = await storage.getPredictions(lat, lng, radius);
      
      const bestSpot = spots[0];
      const avgScore = spots.reduce((acc, s) => acc + s.score, 0) / spots.length;
      
      res.json({
        spots,
        insights: {
          bestSpotId: bestSpot?.id || 0,
          summary: `Found ${spots.length} spots near your destination. Traffic density is ${bestSpot?.trafficDensity || 'Moderate'}.`,
          averageProbability: Math.round(avgScore)
        }
      });
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.parking.history.path, async (req, res) => {
    res.json([]);
  });

  app.get(api.parking.cities.path, async (req, res) => {
    const citiesList = await storage.getCities();
    res.json(citiesList);
  });

  app.get(api.parking.evStations.path, async (req, res) => {
    const cityId = parseInt(req.query.cityId as string);
    const stations = await storage.getEvStationsByCity(cityId);
    res.json(stations);
  });

  app.post(api.parking.reports.path, async (req, res) => {
    const report = await storage.createReport(req.body);
    res.status(201).json(report);
  });

  // Seed Initial Data
  async function seed() {
    const existingCities = await storage.getCities();
    if (existingCities.length === 0) {
      const mumbai = await storage.createCity({ name: "Mumbai", latitude: "19.0760", longitude: "72.8777", zoomLevel: 12 });
      const delhi = await storage.createCity({ name: "Delhi", latitude: "28.6139", longitude: "77.2090", zoomLevel: 12 });
      
      await storage.createEvStation({ name: "FastCharge Mumbai Hub", latitude: "19.0800", longitude: "72.8800", chargerType: "fast", powerRating: 50, cityId: mumbai.id });
      await storage.createEvStation({ name: "Delhi Green Station", latitude: "28.6200", longitude: "77.2150", chargerType: "normal", powerRating: 22, cityId: delhi.id });
    }
  }
  seed().catch(console.error);

  return httpServer;
}
