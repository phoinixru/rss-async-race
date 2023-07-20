export type Car = {
  id: number;
  name: string;
  color: string;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type Sort = 'id' | 'wins' | 'time';

export type Order = 'ASC' | 'DESC';

export enum Makes {
  'Mercedes-Benz',
  'Audi',
  'GMC',
  'Hyundai',
  'Honda',
  'Lucid',
  'Nissan',
  'Volkswagen',
  'McLaren',
  'Subaru',
  'Toyota',
  'Lamborghini',
  'Lincoln',
}

export enum Models {
  'Accord',
  'Accent',
  'Altima',
  'Atlas',
  'Blazer',
  'BRZ',
  'Carnival',
  'Cayenne',
  'Charger',
  'CLE',
  'Corolla',
  'Corsair',
  'Crown',
  'CX-9',
}

export type ElementProps = {
  className?: string;
  innerHTML?: string;
  href?: string;
  placeholder?: string;
} | null;

export abstract class App {
  public abstract start(): void;
}
