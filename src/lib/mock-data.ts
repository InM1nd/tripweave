import { Trip, Role } from "@/types";

const mockUsers = [
  {
    id: "user_1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    id: "user_2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "user_3",
    name: "Mike Brown",
    email: "mike@example.com",
    avatar: "https://i.pravatar.cc/150?u=mike",
  },
];

export const mockTrips: Trip[] = [
  {
    id: "trip_1",
    name: "Japan 2026",
    destination: "Tokyo, Kyoto, Osaka",
    startDate: new Date("2026-04-01"),
    endDate: new Date("2026-04-15"),
    coverImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop",
    currency: "JPY",
    members: [
      { id: "tm_1", userId: "user_1", tripId: "trip_1", role: Role.OWNER, user: mockUsers[0] },
      { id: "tm_2", userId: "user_2", tripId: "trip_1", role: Role.MEMBER, user: mockUsers[1] },
    ],
    _count: {
      events: 12,
      documents: 5,
    },
  },
  {
    id: "trip_2",
    name: "Weekend in Paris",
    destination: "Paris, France",
    startDate: new Date("2025-06-12"),
    endDate: new Date("2025-06-15"),
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    currency: "EUR",
    members: [
      { id: "tm_3", userId: "user_1", tripId: "trip_2", role: Role.OWNER, user: mockUsers[0] },
      { id: "tm_4", userId: "user_3", tripId: "trip_2", role: Role.ADMIN, user: mockUsers[2] },
    ],
    _count: {
      events: 4,
      documents: 2,
    },
  },
  {
    id: "trip_3",
    name: "New York Christmas",
    destination: "New York, USA",
    startDate: new Date("2025-12-20"),
    endDate: new Date("2025-12-27"),
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    currency: "USD",
    members: [
      { id: "tm_5", userId: "user_1", tripId: "trip_3", role: Role.OWNER, user: mockUsers[0] },
    ],
    _count: {
      events: 0,
      documents: 0,
    },
  },
];
