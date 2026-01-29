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
          spots: z.array(z.custom<any>()), // Using custom for the complex prediction object
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
        200: z.array(z.custom<typeof parkingSpots.$inferSelect>())
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
