import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isAfter, isBefore } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const CustomDatePicker = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      onChange(day, null);
    } else {
      if (isBefore(day, startDate)) {
        onChange(day, startDate);
      } else {
        onChange(startDate, day);
      }
      setIsOpen(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 }); // Senin

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-xs text-gray-400 py-2">
          {format(addDays(startDate, i), 'EEEEEE', { locale: id })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateGrid;
    let formattedDate = '';

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        // Determine styles
        const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
        const isBetween = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        
        let cellClasses = "w-9 h-9 flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors m-0.5 ";
        
        if (!isCurrentMonth) {
          cellClasses += "text-gray-300 hover:text-gray-500";
        } else if (isSelected) {
          cellClasses += "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30";
        } else if (isBetween) {
          cellClasses += "bg-blue-50 text-blue-700 font-medium";
        } else {
          cellClasses += "text-gray-700 hover:bg-gray-100";
        }

        days.push(
          <div
            key={day}
            onClick={() => onDateClick(cloneDay)}
            className="flex justify-center"
          >
            <div className={cellClasses}>
              {formattedDate}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const displayValue = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd MMM yyyy', { locale: id })} - ${format(endDate, 'dd MMM yyyy', { locale: id })}`;
    } else if (startDate) {
      return `${format(startDate, 'dd MMM yyyy', { locale: id })} - Pilih tanggal akhir`;
    }
    return "Semua Waktu";
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange(null, null);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={popoverRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <CalendarIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{displayValue()}</span>
        </div>
        {(startDate || endDate) && (
          <button onClick={clearDate} className="text-gray-400 hover:text-red-500 p-0.5 rounded-full hover:bg-red-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 md:left-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[320px] origin-top-left animate-in fade-in zoom-in-95 duration-200">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500 text-center">
            Pilih tanggal mulai, lalu tanggal akhir.
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
