import { z } from 'zod';
import { insertSearchSchema, parkingSpots } from './schema';

export const api = {
  parking: {
    search: {
      method: 'GET' as const,
      path: '/api/parking/search',
      input: z.object({
        lat: z.string().transform(val => parseFloat(val)),
        lng: z.string().transform(val => parseFloat(val)),
        radius: z.string().optional().transform(val => val ? parseInt(val) : 500), // meters
        query: z.string().optional(),
      }),
      responses: {
        200: z.object({
          spots: z.array(z.custom<any>()),
          insights: z.object({
            bestSpotId: z.number(),
            summary: z.string(),
            averageProbability: z.number(),
          })
        })
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<any>())
      }
    },
    cities: {
      method: 'GET' as const,
      path: '/api/cities',
      responses: {
        200: z.array(z.custom<any>())
      }
    },
    evStations: {
      method: 'GET' as const,
      path: '/api/ev-stations',
      input: z.object({
        cityId: z.string().transform(val => parseInt(val))
      }),
      responses: {
        200: z.array(z.custom<any>())
      }
    },
    reports: {
      method: 'POST' as const,
      path: '/api/reports',
      input: z.object({
        type: z.string(),
        latitude: z.string(),
        longitude: z.string(),
        description: z.string().optional()
      }),
      responses: {
        201: z.custom<any>()
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
