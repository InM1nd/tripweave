export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TripMember {
  id: string;
  userId: string;
  tripId: string;
  role: Role;
  user: User;
}

export type CoverColorKey = "electric" | "coral" | "lime" | "sky" | "amber" | "pink";

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  coverImage?: string;
  coverColor?: CoverColorKey | string | null;
  currency: string;
  members: TripMember[];
  _count?: {
    events: number;
    documents: number;
    budget?: number;
  };
}
