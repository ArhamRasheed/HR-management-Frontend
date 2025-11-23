import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MonthYearPicker = ({ value, onChange, placeholder = "mm/dd/yyyy" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  const [selectedYear, setSelectedYear] = useState(
    value?.year || currentYear
  );
  const [selectedMonth, setSelectedMonth] = useState(value?.month || null);
  const dropdownRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate years from 5 years ago to current year
  const startYear = currentYear - 5;
  const years = Array.from({ length: 6 }, (_, i) => startYear + i);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMonthSelect = (monthIndex) => {
    const month = monthIndex + 1;

    // Prevent selecting future months in current year
    if (selectedYear === currentYear && month > currentMonth) {
      return;
    }

    setSelectedMonth(month);
    onChange({ month, year: selectedYear });
    setIsOpen(false);
  };

  const handleYearChange = (direction) => {
    const newYear = selectedYear + direction;

    // Prevent going beyond current year or below minimum year
    if (newYear > currentYear || newYear < years[0]) {
      return;
    }

    setSelectedYear(newYear);
  };

  // Check if a month should be disabled
  const isMonthDisabled = (monthIndex) => {
    const month = monthIndex + 1;
    // Disable if year is current and month is in the future
    return selectedYear === currentYear && month > currentMonth;
  };

  // Check if year navigation should be disabled
  const canGoNextYear = selectedYear < currentYear;
  const canGoPrevYear = selectedYear > years[0];

  const displayValue =
    value?.month && value?.year
      ? `${String(value.month).padStart(2, "0")}/${value.year}`
      : "";

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedMonth(null);
    onChange({ month: null, year: null });
  };

  return (
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none cursor-pointer flex items-center transition-colors"
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
      </div>

      {/* Calendar Icon */}
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72">
          {/* Year Selector */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <button
              onClick={() => handleYearChange(-1)}
              disabled={!canGoPrevYear}
              className={`p-1.5 rounded-md transition-colors ${
                canGoPrevYear
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-lg text-gray-900">
              {selectedYear}
            </span>
            <button
              onClick={() => handleYearChange(1)}
              disabled={!canGoNextYear}
              className={`p-1.5 rounded-md transition-colors ${
                canGoNextYear
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {months.map((month, index) => {
              const isSelected =
                selectedMonth === index + 1 && value?.year === selectedYear;
              const isDisabled = isMonthDisabled(index);

              return (
                <button
                  key={month}
                  onClick={() => !isDisabled && handleMonthSelect(index)}
                  disabled={isDisabled}
                  className={`py-2.5 px-3 text-sm font-medium rounded-md transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : isDisabled
                      ? "text-gray-300 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-100 text-gray-700 hover:shadow-sm"
                  }`}
                  type="button"
                >
                  {month.substring(0, 3)}
                </button>
              );
            })}
          </div>

          {/* Clear Button */}
          {displayValue && (
            <button
              onClick={handleClear}
              className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border-t border-gray-200 pt-3 transition-colors"
              type="button"
            >
              Clear Selection
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
