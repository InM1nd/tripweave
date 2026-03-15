"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrips } from "@/actions/trip";

export function useTrips() {
    return useQuery({
        queryKey: ["trips"],
        queryFn: () => getTrips(),
        staleTime: 5 * 60 * 1000,
    });
}
