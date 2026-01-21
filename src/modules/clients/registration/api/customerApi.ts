import { httpClient } from 'Common/api/httpClient.ts';

export interface CustomerResponse {
  customerId: number;
  email: string;
  phoneNumber: string;
  inn: string;
  surname: string;
  name: string;
  patronymic: string;
  documentType: number;
  documentSeries: string;
  documentNo: string;
}

export interface RegisterCustomerPayload {
  customerId: string;
  email: string;
  phoneNumber: string;
}

export async function fetchCustomerById(id: string): Promise<CustomerResponse> {
  const { data } = await httpClient.get<CustomerResponse>(`/customer/${id}`, {
    headers: {
      accept: '*/*',
    },
  });

  return data;
}

export async function registerCustomer(payload: RegisterCustomerPayload): Promise<void> {
  await httpClient.post('/customer/register', payload, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  });
}
