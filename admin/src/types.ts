export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  grade?: number;
  events?: string[];
  team?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AthleteCreate = Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>;

export type AthleteUpdate = Partial<AthleteCreate>;
