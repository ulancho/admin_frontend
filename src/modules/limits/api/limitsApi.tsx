import { httpClient } from 'Common/api/httpClient.ts';

export interface TransactionLimit {
  id: number;
  name: string;
  amountPerDay: number;
  amountPerMonth: number;
  type: string;
  transactionType: {
    id: number;
    name: string;
  };
}

export interface TransactionType {
  id: number;
  name: string;
  limit: object | null;
}

export type LimitIdentificationType = 'FULL_IDENTIFICATION' | 'ONLINE_IDENTIFICATION';

export interface CreateLimitPayload {
  transactionTypeId: number;
  name: string;
  amountPerDay: number;
  amountPerMonth: number;
  type: LimitIdentificationType;
}

export async function fetchLimits(): Promise<TransactionLimit[]> {
  const { data } = await httpClient.get<TransactionLimit[]>('/service/transactions/limits/all', {
    headers: {
      accept: '*/*',
    },
  });

  return data;
}

export async function fetchTransactionTypes(): Promise<TransactionType[]> {
  const { data } = await httpClient.get<TransactionType[]>('/service/transactions/types', {
    headers: {
      accept: '*/*',
    },
  });

  return data;
}

export async function fetchLimit(limitId: number): Promise<TransactionLimit> {
  const { data } = await httpClient.get<TransactionLimit>(
    `/service/transactions/limits/${limitId}`,
    {
      headers: {
        accept: '*/*',
      },
    },
  );

  return data;
}

export async function createTransactionLimit(payload: CreateLimitPayload): Promise<void> {
  await httpClient.post('/service/transactions/limits', payload, {
    headers: {
      accept: '*/*',
    },
  });
}

export async function deleteTransactionLimit(limitId: number): Promise<void> {
  await httpClient.delete(`/service/transactions/limits/${limitId}`, {
    headers: {
      accept: '*/*',
    },
  });
}
