import { db } from "./db";
import {
  parkingSpots,
  searches,
  type InsertSpot,
  type InsertSearch,
  type ParkingSpot,
  type Search,
  type ParkingPrediction
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // CRUD
  createSpot(spot: InsertSpot): Promise<ParkingSpot>;
  getSpots(): Promise<ParkingSpot[]>;
  logSearch(search: InsertSearch): Promise<Search>;
  getRecentSearches(): Promise<Search[]>;
  
  // Simulation Logic
  getPredictions(lat: number, lng: number, radius: number): Promise<ParkingPrediction[]>;
}

export class DatabaseStorage implements IStorage {
  async createSpot(spot: InsertSpot): Promise<ParkingSpot> {
    const [newSpot] = await db.insert(parkingSpots).values(spot).returning();
    return newSpot;
  }

  async getSpots(): Promise<ParkingSpot[]> {
    return await db.select().from(parkingSpots);
  }

  async logSearch(search: InsertSearch): Promise<Search> {
    const [newSearch] = await db.insert(searches).values(search).returning();
    return newSearch;
  }

  async getRecentSearches(): Promise<Search[]> {
    return await db.select().from(searches).limit(10).orderBy(searches.timestamp);
  }

  async getPredictions(lat: number, lng: number, radius: number): Promise<ParkingPrediction[]> {
    // In a real app, this would query geospatial data.
    // Here we will simulate "Smart City" data by generating spots around the requested location.
    
    const predictions: ParkingPrediction[] = [];
    const count = 5 + Math.floor(Math.random() * 5); // 5-10 spots

    for (let i = 0; i < count; i++) {
      // Random offset from center lat/lng
      const latOffset = (Math.random() - 0.5) * 0.01; // approx 1km
      const lngOffset = (Math.random() - 0.5) * 0.01;
      
      const probabilityRoll = Math.random();
      let probability: "High" | "Medium" | "Low" = "Low";
      let score = 30 + Math.floor(Math.random() * 30);
      
      if (probabilityRoll > 0.6) {
        probability = "High";
        score = 80 + Math.floor(Math.random() * 20);
      } else if (probabilityRoll > 0.3) {
        probability = "Medium";
        score = 50 + Math.floor(Math.random() * 30);
      }

      const trafficDensity = Math.random() > 0.7 ? "High" : (Math.random() > 0.4 ? "Moderate" : "Low");
      
      predictions.push({
        id: i + 1,
        name: `Spot #${i + 1} - ${probability === 'High' ? 'Premium' : 'Standard'} Zone`,
        location: {
          lat: lat + latOffset,
          lng: lng + lngOffset
        },
        probability,
        score,
        availableSpaces: Math.floor(Math.random() * 15),
        trafficDensity,
        legalStatus: "Legal (2hr limit)",
        distance: `${Math.floor(Math.random() * 500 + 100)}m`,
        walkingTime: `${Math.floor(Math.random() * 10 + 2)} min`
      });
    }
    
    return predictions.sort((a, b) => b.score - a.score);
  }
}

export const storage = new DatabaseStorage();
