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

export type Engine = {
  velocity: number;
  distance: number;
};

export type EngineStatus = 'started' | 'stopped' | 'drive';

export type Sort = 'id' | 'wins' | 'time';

export type Order = 'ASC' | 'DESC';

export type ElementProps = {
  className?: string;
  innerHTML?: string;
  href?: string;
  placeholder?: string;
  type?: string;
} | null;

export abstract class App {
  public abstract start(): void;
}

export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}
