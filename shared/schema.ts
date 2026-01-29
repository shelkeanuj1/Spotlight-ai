import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Parking spots database (seeded with some known spots, others generated)
export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude").notNull(), // text to preserve precision
  longitude: text("longitude").notNull(),
  type: text("type").notNull(), // 'street', 'garage', 'lot'
  capacity: integer("capacity").default(10),
  hourlyRate: integer("hourly_rate").default(20), // In Rupees
});

// Search history for analytics
export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Base schemas
export const insertSpotSchema = createInsertSchema(parkingSpots).omit({ id: true });
export const insertSearchSchema = createInsertSchema(searches).omit({ id: true, timestamp: true });

// Types
export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type InsertSpot = z.infer<typeof insertSpotSchema>;
export type Search = typeof searches.$inferSelect;
export type InsertSearch = z.infer<typeof insertSearchSchema>;

// API Contract Types

// Prediction response object
export interface ParkingPrediction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  probability: "High" | "Medium" | "Low";
  score: number; // 0-100
  availableSpaces: number;
  trafficDensity: "Low" | "Moderate" | "High";
  legalStatus: string;
  distance: string; // e.g. "200m"
  walkingTime: string; // e.g. "3 min"
}

export interface SearchResponse {
  spots: ParkingPrediction[];
  insights: {
    bestSpotId: number;
    summary: string;
    averageProbability: number;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}
