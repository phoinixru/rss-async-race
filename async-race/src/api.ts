import { SERVER_HOST, SERVER_PORT } from './config';
import { Car, Engine, EngineStatus, Winner, StatusCodes, Sort, Order } from './types';
import { assign, stringify } from './utils';

const apiUrl = `${SERVER_HOST}:${SERVER_PORT}`;

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Success = { success: boolean };

type ResponseContent = Car | Car[] | Winner | Winner[] | Success | Engine;

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

async function apiRequest<T extends ResponseContent>(params: RequestParams): Promise<ApiResponse<T>> {
  const { method, endpoint, dataParams, queryParams } = params;
  const url = `${apiUrl}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
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
  const params: RequestParams = { method: 'GET', endpoint, dataParams };
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

async function manipulateEngine(id: number, status: EngineStatus): Promise<ApiResponse<Engine>> {
  const queryParams = new URLSearchParams({ id: String(id), status }).toString();
  const params: RequestParams = { method: 'GET', endpoint: Endpoints.ENGINE, queryParams };
  const result = await apiRequest<Engine>(params);

  return result;
}

export { getCars, createCar, updateCar, manipulateEngine, getWinners };
