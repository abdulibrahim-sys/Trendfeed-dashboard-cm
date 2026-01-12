'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { DateRangePreset, dateRangeLabels, getDateRange } from '@/lib/dateUtils';

interface DateRangeSelectorProps {
  selectedPreset: DateRangePreset;
  onRangeChange: (preset: DateRangePreset, startDate?: string, endDate?: string) => void;
}

export default function DateRangeSelector({ selectedPreset, onRangeChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const presets: DateRangePreset[] = [
    'today',
    'last7days',
    'last30days',
    'monthToDate',
    'last3months',
    'last6months',
    'last12months',
    'allTime',
  ];

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange(preset);
      setIsOpen(false);
    }
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onRangeChange('custom', customStart, customEnd);
      setIsOpen(false);
      setShowCustom(false);
    }
  };

  const getDisplayLabel = () => {
    if (selectedPreset === 'custom' && customStart && customEnd) {
      return `${customStart} to ${customEnd}`;
    }
    return dateRangeLabels[selectedPreset];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Calendar className="h-4 w-4" />
        <span>{getDisplayLabel()}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setShowCustom(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
            {!showCustom ? (
              <div className="py-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedPreset === preset ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {dateRangeLabels[preset]}
                  </button>
                ))}
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => setShowCustom(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Custom Range
                </button>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Date Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleCustomApply}
                      disabled={!customStart || !customEnd}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setShowCustom(false)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
