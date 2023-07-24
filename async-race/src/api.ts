import { ENGINE_SPEED, EXTRA_HOST, SERVER_HOSTS, SERVER_PORT } from './config';
import { Car, Engine, EngineStatus, Winner, StatusCodes, Sort, Order } from './types';
import { assign, stringify } from './utils';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Success = { success: boolean };

type Empty = Record<string, never>;

type ResponseContent = Car | Car[] | Winner | Winner[] | Success | Engine | Empty;

type ApiResponse<T extends ResponseContent> = {
  status: StatusCodes;
  message?: string;
  content?: T;
  total?: number;
};

type RequestParams = {
  method: Method;
  endpoint: string;
  queryParams?: string;
  dataParams?: string;
};

enum Endpoints {
  GARAGE = '/garage',
  CAR = '/garage/:id',
  ENGINE = '/engine',
  WINNERS = '/winners',
  WINNER = '/winners/:id',
}

const getEndpoint = (endpoint: Endpoints, id: number): string => endpoint.replace(':id', String(id));

const requestHeaders = { 'Content-Type': 'application/json' };

async function checkExtraHost(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000);
  const url = `http://${EXTRA_HOST}:${SERVER_PORT}/db`;
  const result = await fetch(url, { method: 'HEAD', signal: controller.signal });
  const { status } = result;

  clearTimeout(timeoutId);
  if ([StatusCodes.OK].includes(status)) {
    SERVER_HOSTS.push(EXTRA_HOST);
    return true;
  }
  return false;
}

let requestIndex = 0;
async function apiRequest<T extends ResponseContent>(params: RequestParams): Promise<ApiResponse<T>> {
  const { method, endpoint, dataParams, queryParams } = params;
  const host = SERVER_HOSTS[requestIndex % SERVER_HOSTS.length];
  requestIndex += 1;
  const url = `http://${host}:${SERVER_PORT}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  const options = { method };

  if (dataParams) {
    assign(options, { body: dataParams, headers: requestHeaders });
  }

  const result = await fetch(url, options);
  const { status, headers } = result;
  const response = { status };

  let content: T;
  if ([StatusCodes.OK, StatusCodes.CREATED].includes(status)) {
    content = (await result.json()) as T;
    assign(response, { content });
  }

  const totalCount = headers.get('X-Total-Count');
  if (totalCount) {
    assign(response, { total: +totalCount });
  }

  return response;
}

async function createCar(car: Partial<Car>): Promise<ApiResponse<Car>> {
  const dataParams = stringify(car);
  const params: RequestParams = { method: 'POST', endpoint: Endpoints.GARAGE, dataParams };
  const result = await apiRequest<Car>(params);

  return result;
}

async function updateCar(id: number, car: Partial<Car>): Promise<ApiResponse<Car>> {
  const dataParams = stringify(car);
  const endpoint = getEndpoint(Endpoints.CAR, id);
  const params: RequestParams = { method: 'PUT', endpoint, dataParams };
  const result = await apiRequest<Car>(params);

  return result;
}

async function deleteCar(id: number): Promise<ApiResponse<Empty>> {
  const endpoint = getEndpoint(Endpoints.CAR, id);
  const params: RequestParams = { method: 'DELETE', endpoint };
  const result = await apiRequest<Empty>(params);

  return result;
}

async function getCar(id: number): Promise<ApiResponse<Car>> {
  const endpoint = getEndpoint(Endpoints.CAR, id);
  const params: RequestParams = { method: 'GET', endpoint };
  const result = await apiRequest<Car>(params);

  return result;
}

async function getCars(page: number, limit: number): Promise<ApiResponse<Car[]>> {
  const queryParams = new URLSearchParams({ _page: String(page), _limit: String(limit) }).toString();
  const params: RequestParams = { method: 'GET', endpoint: Endpoints.GARAGE, queryParams };
  const result = await apiRequest<Car[]>(params);

  return result;
}

async function getWinners(page: number, limit: number, sort: Sort, order: Order): Promise<ApiResponse<Winner[]>> {
  const queryParams = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
    _sort: sort,
    _order: order,
  }).toString();
  const params: RequestParams = { method: 'GET', endpoint: Endpoints.WINNERS, queryParams };

  const result = await apiRequest<Winner[]>(params);

  return result;
}

async function createWinner(winner: Partial<Winner>): Promise<ApiResponse<Winner>> {
  const dataParams = stringify(winner);
  const params: RequestParams = { method: 'POST', endpoint: Endpoints.WINNERS, dataParams };
  const result = await apiRequest<Winner>(params);

  return result;
}

async function updateWinner(id: number, winner: Partial<Winner>): Promise<ApiResponse<Winner>> {
  const dataParams = stringify(winner);
  const endpoint = getEndpoint(Endpoints.WINNER, id);
  const params: RequestParams = { method: 'PUT', endpoint, dataParams };
  const result = await apiRequest<Winner>(params);

  return result;
}

async function getWinner(id: number): Promise<ApiResponse<Winner | Empty>> {
  const endpoint = getEndpoint(Endpoints.WINNER, id);
  const params: RequestParams = { method: 'GET', endpoint };
  const result = await apiRequest<Winner | Empty>(params);

  return result;
}

async function deleteWinner(id: number): Promise<ApiResponse<Empty>> {
  const endpoint = getEndpoint(Endpoints.WINNER, id);
  const params: RequestParams = { method: 'DELETE', endpoint };
  const result = await apiRequest<Empty>(params);

  return result;
}

async function manipulateEngine(id: number, status: EngineStatus): Promise<ApiResponse<Engine>> {
  const query = { id: String(id), status };
  if (status === 'stopped') {
    assign(query, { speed: '0' });
  } else if (ENGINE_SPEED >= 0) {
    assign(query, { speed: `${ENGINE_SPEED}` });
  }
  const queryParams = new URLSearchParams(query).toString();
  const params: RequestParams = { method: 'PATCH', endpoint: Endpoints.ENGINE, queryParams };
  const result = await apiRequest<Engine>(params);

  return result;
}

export {
  checkExtraHost,
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  manipulateEngine,
  getWinners,
  createWinner,
  updateWinner,
  getWinner,
  deleteWinner,
};
