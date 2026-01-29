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
      // Validate input manually since query params come as strings
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = req.query.radius ? parseInt(req.query.radius as string) : 500;
      const query = req.query.query as string;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid coordinates" });
      }

      // Log the search
      if (query) {
        await storage.logSearch({
          query,
          latitude: String(lat),
          longitude: String(lng)
        });
      }

      const spots = await storage.getPredictions(lat, lng, radius);
      
      // Calculate insights
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
    const history = await storage.getRecentSearches();
    res.json(history);
  });

  // Seed basic data if needed (though we generate predictions on the fly)
  return httpServer;
}
