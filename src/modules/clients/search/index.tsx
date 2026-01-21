import { ListFilterPlus } from 'lucide-react';
import { useState } from 'react';

import { PAGE_SIZE_OPTIONS } from 'Modules/transactions/constants';

export default function Search() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filtersVisible, setFiltersVisible] = useState(false);

  function toggleFiltersVisibility() {
    setFiltersVisible((current) => !current);
  }

  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < totalPages;
  const showingFrom = totalElements === 0 ? 0 : page * pageSize + 1;
  const showingTo = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="mx-auto h-full max-w-[100%]">
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
              <div className="flex flex-wrap gap-4"></div>
            </div>
            <div className="flex gap-3 mt-3.5">
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
              >
                Сбросить
              </button>
              <button
                type="button"
                className="rounded-md border border-border-secondary px-4 py-2 text-sm font-medium text-text-black transition-colors hover:bg-gray-100 cursor-pointer"
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
            <div className="flex gap-6 py-3 border-b border-border-secondary">
              <div className="w-[120px] flex-shrink-0 text-sm font-semibold leading-none text-text-black">
                ID
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Дата
              </div>
              <div className="w-[160px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Тип
              </div>
              <div className="w-[150px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Статус
              </div>
              <div className="w-[130px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Сумма
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Счёт списания
              </div>
              <div className="w-[170px] flex-shrink-0 px-2 text-sm font-semibold leading-none text-text-black">
                Счёт зачисления
              </div>
              <div className="flex flex-1 flex-shrink-0 px-4 text-sm font-semibold leading-none text-text-black">
                Комментарий
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-10 text-sm text-text-gray">
                Загрузка...
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center justify-center py-10 text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && 0 === 0 && (
              <div className="flex items-center justify-center py-10 text-sm text-text-gray">
                Нет данных для отображения
              </div>
            )}
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
