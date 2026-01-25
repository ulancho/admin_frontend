import { httpClient } from 'Common/api/httpClient.ts';

export interface CustomerSearchItem {
  customerId: number;
  inn: string;
  email: string;
  phoneNumber: string;
  surname: string;
  name: string;
  patronymic: string;
  preferredLanguage: string;
}

export interface CustomersResponse {
  content: CustomerSearchItem[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface FetchCustomersParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: SortDirection;
  signal?: AbortSignal;
}

export async function fetchCustomers({
  page = 0,
  size = 10,
  sortBy = '',
  direction = 'desc',
  signal,
}: FetchCustomersParams = {}): Promise<CustomersResponse> {
  const { data } = await httpClient.get<CustomersResponse>('/customer/search', {
    params: {
      page,
      size,
      sortBy,
      direction,
    },
    headers: {
      accept: '*/*',
    },
    signal,
  });

  return data;
}
