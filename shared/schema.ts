import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Cities configuration
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  zoomLevel: integer("zoom_level").default(12),
});

// Parking spots database
export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  type: text("type").notNull(), // 'street', 'garage', 'lot'
  capacity: integer("capacity").default(10),
  hourlyRate: integer("hourly_rate").default(20),
  cityId: integer("city_id").references(() => cities.id),
});

// EV Charging Stations
export const evStations = pgTable("ev_stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  chargerType: text("charger_type").notNull(), // 'fast', 'normal'
  powerRating: integer("power_rating").notNull(), // kW
  available: boolean("available").default(true),
  cityId: integer("city_id").references(() => cities.id),
});

// User feedback/reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'free_spot', 'blocked_spot', 'illegal_parking'
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Search history
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
export const insertEvStationSchema = createInsertSchema(evStations).omit({ id: true });
export const insertReportSchema = createInsertSchema(reports).omit({ id: true, timestamp: true });
export const insertCitySchema = createInsertSchema(cities).omit({ id: true });

// Types
export type ParkingSpot = typeof parkingSpots.$inferSelect;
export type EvStation = typeof evStations.$inferSelect;
export type City = typeof cities.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Search = typeof searches.$inferSelect;

// API Contract Types
export interface ParkingPrediction {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  probability: "High" | "Medium" | "Low";
  score: number;
  availableSpaces: number;
  trafficDensity: "Low" | "Moderate" | "High";
  legalStatus: string;
  distance: string;
  walkingTime: string;
}

export interface SearchResponse {
  spots: ParkingPrediction[];
  evStations: EvStation[];
  insights: {
    bestSpotId: number;
    summary: string;
    averageProbability: number;
  };
}
