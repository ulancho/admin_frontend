import { ListFilterPlus } from 'lucide-react';
import { type ChangeEvent, useEffect, useState } from 'react';

import {
  fetchCustomers,
  type CustomerSearchItem,
  type FetchCustomersParams,
  type SortDirection,
} from 'Modules/clients/search/api/customerSearchApi.ts';
import { PAGE_SIZE_OPTIONS } from 'Modules/transactions/constants';

export default function Search() {
  const [customers, setCustomers] = useState<CustomerSearchItem[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    customerId: '',
    inn: '',
    email: '',
    phoneNumber: '',
    surname: '',
    name: '',
    patronymic: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const sortBy: FetchCustomersParams['sortBy'] = 'id';
  const direction: SortDirection = 'desc';

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadCustomers() {
      setLoading(true);
      setError(null);

      try {
        const trimmedFilters = Object.fromEntries(
          Object.entries(appliedFilters)
            .map(([key, value]) => [key, value.trim()])
            .filter(([, value]) => value !== ''),
        );
        const customerIdValue =
          'customerId' in trimmedFilters &&
          Number.isNaN(Number.parseInt(trimmedFilters.customerId, 10))
            ? trimmedFilters.customerId
            : trimmedFilters.customerId
              ? Number.parseInt(trimmedFilters.customerId, 10)
              : undefined;

        const response = await fetchCustomers({
          page,
          size: pageSize,
          sortBy,
          direction,
          ...(trimmedFilters.customerId !== undefined ? { customerId: customerIdValue } : {}),
          inn: trimmedFilters.inn,
          email: trimmedFilters.email,
          phoneNumber: trimmedFilters.phoneNumber,
          surname: trimmedFilters.surname,
          name: trimmedFilters.name,
          patronymic: trimmedFilters.patronymic,
          signal: controller.signal,
        });

        if (!isActive) {
          return;
        }

        setCustomers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          return;
        }

        setError('Не удалось загрузить список клиентов. Попробуйте обновить страницу.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [page, pageSize, direction, sortBy, appliedFilters]);

  function toggleFiltersVisibility() {
    setFiltersVisible((current) => !current);
  }

  function formatValue(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    return value;
  }

  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < totalPages;
  const showingFrom = totalElements === 0 ? 0 : page * pageSize + 1;
  const showingTo = Math.min((page + 1) * pageSize, totalElements);

  function handleFilterChange(field: keyof typeof filters) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFilters((current) => ({
        ...current,
        [field]: value,
      }));
    };
  }

  function applyFilters() {
    setAppliedFilters(filters);
    setPage(0);
  }

  function resetFilters() {
    const emptyFilters = {
      customerId: '',
      inn: '',
      email: '',
      phoneNumber: '',
      surname: '',
      name: '',
      patronymic: '',
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(0);
  }

  return (
    <div className="h-full max-w-[100%]">
      <div className="flex h-full flex-col items-start gap-8">
        <header className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold leading-none text-text-black">Клиенты</h1>
          <button
            type="button"
            className="flex gap-2 w-full border rounded border-amber-950 px-4 py-2 transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer"
            onClick={toggleFiltersVisibility}
          >
            <ListFilterPlus className="w-4" />
            <p className="text-sm font-medium text-text-black">Фильтр</p>
          </button>
        </header>
        {filtersVisible && (
          <div className="w-full rounded-[10px] border border-border-primary bg-white p-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
              <div className="flex flex-wrap gap-4">
                <label className="flex w-full max-w-[200px] flex-col gap-1 text-sm text-text-gray">
                  ID клиента
                  <input
                    type="text"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.customerId}
                    onChange={handleFilterChange('customerId')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  ИНН
                  <input
                    type="text"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.inn}
                    onChange={handleFilterChange('inn')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  Email
                  <input
                    type="email"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.email}
                    onChange={handleFilterChange('email')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  Телефон
                  <input
                    type="tel"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.phoneNumber}
                    onChange={handleFilterChange('phoneNumber')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  Фамилия
                  <input
                    type="text"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.surname}
                    onChange={handleFilterChange('surname')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  Имя
                  <input
                    type="text"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.name}
                    onChange={handleFilterChange('name')}
                  />
                </label>
                <label className="flex w-full max-w-[240px] flex-col gap-1 text-sm text-text-gray">
                  Отчество
                  <input
                    type="text"
                    className="rounded-md border border-border-secondary px-3 py-2 text-sm text-text-black"
                    value={filters.patronymic}
                    onChange={handleFilterChange('patronymic')}
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-3.5">
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={resetFilters}
              >
                Сбросить
              </button>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={applyFilters}
              >
                Применить
              </button>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFiltersVisible(false);
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
        <div className="w-full rounded-[10px] border border-border-primary overflow-x-auto bg-white p-3 lg:p-3">
          <div className="w-full overflow-x-auto px-2">
            <table className="min-w-full border-collapse text-left">
              <colgroup>
                <col className="w-[120px]" />
                <col className="w-[160px]" />
                <col className="w-[160px]" />
                <col className="w-[180px]" />
                <col className="w-[140px]" />
                <col className="w-[200px]" />
                <col className="w-[150px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border-secondary">
                  <th className="py-3 text-sm font-semibold leading-none text-text-black">ID</th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    Фамилия
                  </th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    Имя
                  </th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    Отчество
                  </th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    ИНН
                  </th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    Email
                  </th>
                  <th className="px-2 py-3 text-sm font-semibold leading-none text-text-black">
                    Телефон
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-text-gray">
                      Загрузка...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-red-600">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && customers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-text-gray">
                      Нет данных для отображения
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  customers.map((customer) => (
                    <tr key={customer.customerId} className="border-b border-transparent">
                      <td className="py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.customerId)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.surname)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.name)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.patronymic)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.inn)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.email)}
                      </td>
                      <td className="px-2 py-3 text-sm font-normal leading-none text-text-black">
                        {formatValue(customer.phoneNumber)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-sm text-text-gray">
              <label className="flex items-center gap-2">
                <span>Показывать по:</span>
                <select
                  className="rounded-md border border-border-secondary px-2 py-1 text-sm text-text-black"
                  value={pageSize}
                  onChange={(event) => {
                    const newSize = Number.parseInt(event.target.value, 10);
                    setPageSize(newSize);
                    setPage(0);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <span>
                Показано {totalElements === 0 ? 0 : `${showingFrom}–${showingTo}`} из{' '}
                {totalElements}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-border-secondary px-3 py-1 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={!canGoPrevious || loading}
              >
                Назад
              </button>
              <span className="text-sm text-text-gray">
                Страница {totalPages === 0 ? 0 : page + 1} из {totalPages}
              </span>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-3 py-1 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setPage((current) => (canGoNext ? current + 1 : current))}
                disabled={!canGoNext || loading}
              >
                Вперёд
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
