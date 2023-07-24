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

export type DriveResult = {
  car: Car;
  time: number;
};

export type Engine = {
  velocity: number;
  distance: number;
};

export const ENGINE_STATUS = {
  STARTED: 'started',
  STOPPED: 'stopped',
  DRIVE: 'drive',
};

type ValueOf<T> = T[keyof T];

export type EngineStatus = ValueOf<typeof ENGINE_STATUS>;

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

declare global {
  interface DocumentEventMap {
    'car-create': CustomEvent;
    'car-update': CustomEvent<number>;
    'car-delete': CustomEvent<number>;
    'winner-create': CustomEvent;
    'winner-update': CustomEvent<number>;
    'winner-delete': CustomEvent<number>;
  }
}
