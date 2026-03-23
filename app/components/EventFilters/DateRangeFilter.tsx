import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

interface DateRangeFilterProps {
  onChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  showPresets?: boolean;
}

interface DatePreset {
  label: string;
  getValue: () => { start: Date; end: Date };
}

export default function DateRangeFilter({
  onChange,
  startDate: initialStartDate = null,
  endDate: initialEndDate = null,
  showPresets = false,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>(
    initialStartDate ? initialStartDate.toISOString().split('T')[0] : '',
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate ? initialEndDate.toISOString().split('T')[0] : '',
  );
  const [error, setError] = useState<string>('');

  const getPresets = useCallback((): DatePreset[] => {
    const today = new Date();
    const thisWeekend = new Date(today);
    thisWeekend.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7)); // Next Friday
    const nextSunday = new Date(thisWeekend);
    nextSunday.setDate(thisWeekend.getDate() + 2);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const next30DaysEnd = new Date(today);
    next30DaysEnd.setDate(today.getDate() + 30);

    return [
      {
        label: 'This Weekend',
        getValue: () => ({ start: thisWeekend, end: nextSunday }),
      },
      {
        label: 'This Month',
        getValue: () => ({ start: thisMonthStart, end: thisMonthEnd }),
      },
      {
        label: 'Next 30 Days',
        getValue: () => ({ start: today, end: next30DaysEnd }),
      },
    ];
  }, []);

  const validateAndUpdate = useCallback(
    (start: string, end: string) => {
      if (!start || !end) {
        setError('');
        onChange({
          startDate: start ? new Date(start) : null,
          endDate: end ? new Date(end) : null,
        });
        return;
      }

      const startDateObj = new Date(start);
      const endDateObj = new Date(end);

      if (endDateObj <= startDateObj) {
        setError('End date must be after start date');
        return;
      }

      setError('');
      onChange({
        startDate: startDateObj,
        endDate: endDateObj,
      });
    },
    [onChange],
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStart = e.target.value;
      setStartDate(newStart);
      validateAndUpdate(newStart, endDate);
    },
    [endDate, validateAndUpdate],
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEnd = e.target.value;
      setEndDate(newEnd);
      validateAndUpdate(startDate, newEnd);
    },
    [startDate, validateAndUpdate],
  );

  const handlePresetClick = useCallback(
    (preset: DatePreset) => {
      const { start, end } = preset.getValue();
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      setStartDate(startStr);
      setEndDate(endStr);
      validateAndUpdate(startStr, endStr);
    },
    [validateAndUpdate],
  );

  const handleClear = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setError('');
    onChange({ startDate: null, endDate: null });
  }, [onChange]);

  const presets = useMemo(() => getPresets(), [getPresets]);

  return (
    <div className="date-range-filter">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Date Range</legend>

        <div className="space-y-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end-date" className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {showPresets && (
            <div className="grid grid-cols-1 gap-2 pt-2">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="text-sm px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {(startDate || endDate) && (
        <button
          type="button"
          onClick={handleClear}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
          aria-label="Clear dates"
        >
          Clear Dates
        </button>
      )}
    </div>
  );
}
