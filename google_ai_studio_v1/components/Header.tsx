import React from "react";
import { ViewMode, SortOption, FilterStatus, Theme } from "../types";
import {
  GridIcon,
  ListIcon,
  CardIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
} from "./icons";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  theme: Theme;
  onThemeToggle: () => void;
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onClearSelection: () => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  filterStatus,
  onFilterChange,
  theme,
  onThemeToggle,
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onClearSelection,
  onRefresh,
}) => {
  const viewButtons = [
    { mode: ViewMode.Grid, Icon: GridIcon },
    { mode: ViewMode.List, Icon: ListIcon },
    { mode: ViewMode.Card, Icon: CardIcon },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-screen-2xl mx-auto">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            PhotoFlo
          </h1>
        </div>

        <div className="relative flex-grow w-full md:max-w-xs lg:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={FilterStatus.All}>All Statuses</option>
            <option value={FilterStatus.Approved}>Approved</option>
            <option value={FilterStatus.Pending}>Pending</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={SortOption.DateNewest}>Date: Newest</option>
            <option value={SortOption.DateOldest}>Date: Oldest</option>
            <option value={SortOption.PhotographerAZ}>Photographer: A-Z</option>
            <option value={SortOption.PhotographerZA}>Photographer: Z-A</option>
            <option value={SortOption.TitleAZ}>Title: A-Z</option>
            <option value={SortOption.TitleZA}>Title: Z-A</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-full">
          {viewButtons.map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`p-2 rounded-full transition-colors ${
                viewMode === mode
                  ? "bg-white dark:bg-slate-700 text-indigo-500"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700/50"
              }`}
              aria-label={`Switch to ${mode} view`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Refresh photos"
            title="Refresh photos from Google Sheets"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
      {selectedCount > 0 && (
        <div className="max-w-screen-2xl mx-auto mt-3 p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-between animation-fadeIn">
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
            {selectedCount} photo{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onBulkApprove}
              className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            >
              Approve
            </button>
            <button
              onClick={onBulkReject}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
            >
              Reject
            </button>
            <button
              onClick={onClearSelection}
              className="px-3 py-1 text-sm bg-slate-500 hover:bg-slate-600 text-white rounded-md transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
