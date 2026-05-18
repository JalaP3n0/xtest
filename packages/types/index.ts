export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  SUPERVISOR = 'SUPERVISOR',
  USHER = 'USHER',
}

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId: string | null;
}

export interface EventData {
  id: string;
  title: string;
  status: EventStatus;
  companyId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  startTime: Date;
}
