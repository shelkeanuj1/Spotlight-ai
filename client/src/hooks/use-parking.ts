import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// Types derived from schema
export type SearchInput = z.infer<typeof api.parking.search.input>;
export type SearchResponse = z.infer<typeof api.parking.search.responses[200]>;
export type HistoryResponse = z.infer<typeof api.parking.history.responses[200]>;

// Hook for searching parking spots
export function useParkingSearch(params: SearchInput | null) {
  return useQuery({
    queryKey: [api.parking.search.path, params],
    queryFn: async () => {
      if (!params) return null;

const queryParams: Record<string, string> = {
  lat: params.lat.toString(),
  lng: params.lng.toString(),
  radius: "20000", // ✅ 20km radius
};


      if (params.query) queryParams.query = params.query;

      const url = buildUrl(api.parking.search.path);
      const queryString = new URLSearchParams(queryParams).toString();

      const res = await fetch(`${url}?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch parking spots");

      const data = await res.json();

      console.log("🧠 Parking API Response:", data); // DEBUG

      return data as SearchResponse;
    },
    enabled: !!params,
  });
}


// Hook for fetching search history
export function useSearchHistory() {
  return useQuery({
    queryKey: [api.parking.history.path],
    queryFn: async () => {
      const res = await fetch(api.parking.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.parking.history.responses[200].parse(await res.json());
    },
  });
}
