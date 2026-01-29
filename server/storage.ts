import { db } from "./db";
import {
  parkingSpots,
  searches,
  evStations,
  cities,
  reports,
  type InsertSpot,
  type InsertSearch,
  type ParkingSpot,
  type EvStation,
  type City,
  type Report,
  type InsertReport,
  type ParkingPrediction
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Cities
  getCities(): Promise<City[]>;
  createCity(city: any): Promise<City>;
  
  // Spots & EV
  getSpotsByCity(cityId: number): Promise<ParkingSpot[]>;
  getEvStationsByCity(cityId: number): Promise<EvStation[]>;
  createSpot(spot: InsertSpot): Promise<ParkingSpot>;
  createEvStation(station: any): Promise<EvStation>;
  
  // Search & Reports
  logSearch(search: InsertSearch): Promise<any>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Logic
  getPredictions(lat: number, lng: number, radius: number): Promise<ParkingPrediction[]>;
}

export class DatabaseStorage implements IStorage {
  async getCities(): Promise<City[]> {
    return await db.select().from(cities);
  }

  async createCity(city: any): Promise<City> {
    const [newCity] = await db.insert(cities).values(city).returning();
    return newCity;
  }

  async getSpotsByCity(cityId: number): Promise<ParkingSpot[]> {
    return await db.select().from(parkingSpots).where(eq(parkingSpots.cityId, cityId));
  }

  async getEvStationsByCity(cityId: number): Promise<EvStation[]> {
    return await db.select().from(evStations).where(eq(evStations.cityId, cityId));
  }

  async createSpot(spot: InsertSpot): Promise<ParkingSpot> {
    const [newSpot] = await db.insert(parkingSpots).values(spot).returning();
    return newSpot;
  }

  async createEvStation(station: any): Promise<EvStation> {
    const [newStation] = await db.insert(evStations).values(station).returning();
    return newStation;
  }

  async logSearch(search: InsertSearch): Promise<any> {
    const [newSearch] = await db.insert(searches).values(search).returning();
    return newSearch;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getPredictions(lat: number, lng: number, radius: number): Promise<ParkingPrediction[]> {
    const predictions: ParkingPrediction[] = [];
    const count = 8;

    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.008;
      const lngOffset = (Math.random() - 0.5) * 0.008;
      
      const score = 40 + Math.floor(Math.random() * 55);
      const probability = score > 80 ? "High" : (score > 60 ? "Medium" : "Low");
      
      predictions.push({
        id: Date.now() + i,
        name: `Smart Zone ${String.fromCharCode(65 + i)}`,
        location: { lat: lat + latOffset, lng: lng + lngOffset },
        probability,
        score,
        availableSpaces: Math.floor(Math.random() * 12),
        trafficDensity: score > 75 ? "Low" : (score > 50 ? "Moderate" : "High"),
        legalStatus: "Legal (Public)",
        distance: `${Math.floor(Math.random() * 400 + 50)}m`,
        walkingTime: `${Math.floor(Math.random() * 8 + 1)} min`
      });
    }
    return predictions.sort((a, b) => b.score - a.score);
  }
}

export const storage = new DatabaseStorage();
