import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Photo, ViewMode, SortOption, FilterStatus, Theme } from "./types";
import { googleSheetsService } from "./src/services/googleSheetsService";
import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/Header";
import PhotoGrid from "./components/PhotoGrid";
import PhotoList from "./components/PhotoList";
import PhotoCardView from "./components/PhotoCardView";
import PhotoDetailsPanel from "./components/PhotoDetailsPanel";

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "photo_view_mode",
    ViewMode.Grid
  );
  const [theme, setTheme] = useLocalStorage<Theme>("photo_theme", "light");
  const [sortOption, setSortOption] = useLocalStorage<SortOption>(
    "photo_sort_option",
    SortOption.DateNewest
  );
  const [filterStatus, setFilterStatus] = useLocalStorage<FilterStatus>(
    "photo_filter_status",
    FilterStatus.All
  );

  // Fetch initial data from Google Sheets
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPhotos = await googleSheetsService.fetchPhotos();
        setPhotos(fetchedPhotos);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch photos from Google Sheets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Theme management
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleToggleApproval = useCallback(
    async (id: string, newApprovedStatus: boolean) => {
      try {
        // Update Google Sheets first
        await googleSheetsService.updatePhotoApproval(id, newApprovedStatus);

        // Update local state
        setPhotos((prevPhotos) =>
          prevPhotos.map((p) =>
            p.id === id ? { ...p, approved: newApprovedStatus } : p
          )
        );

        // Also update the selected photo if it's the one being changed
        if (selectedPhoto && selectedPhoto.id === id) {
          setSelectedPhoto((p) =>
            p ? { ...p, approved: newApprovedStatus } : null
          );
        }
      } catch (err) {
        console.error("Error updating photo approval:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update photo approval"
        );
      }
    },
    [selectedPhoto]
  );

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleBulkOperation = async (approve: boolean) => {
    try {
      // Update Google Sheets for all selected photos
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          googleSheetsService.updatePhotoApproval(id, approve)
        )
      );

      // Update local state
      setPhotos((prevPhotos) =>
        prevPhotos.map((p) =>
          selectedIds.has(p.id) ? { ...p, approved: approve } : p
        )
      );
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Error bulk updating photo approvals:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to bulk update photo approvals"
      );
    }
  };

  const handleRefresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPhotos = await googleSheetsService.fetchPhotos();
      setPhotos(fetchedPhotos);
    } catch (err) {
      console.error("Error refreshing photos:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh photos");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredAndSortedPhotos = useMemo(() => {
    return photos
      .filter((photo) => {
        // Filter by status
        if (filterStatus === FilterStatus.Approved) return photo.approved;
        if (filterStatus === FilterStatus.Pending) return !photo.approved;
        return true;
      })
      .filter((photo) => {
        // Filter by search term (searches title, photographer, and tags)
        const lowercasedTerm = searchTerm.toLowerCase();
        return (
          photo.title.toLowerCase().includes(lowercasedTerm) ||
          photo.photographer.toLowerCase().includes(lowercasedTerm) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(lowercasedTerm))
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case SortOption.DateOldest:
            return (
              new Date(a.uploadDate).getTime() -
              new Date(b.uploadDate).getTime()
            );
          case SortOption.PhotographerAZ:
            return a.photographer.localeCompare(b.photographer);
          case SortOption.PhotographerZA:
            return b.photographer.localeCompare(a.photographer);
          case SortOption.TitleAZ:
            return a.title.localeCompare(b.title);
          case SortOption.TitleZA:
            return b.title.localeCompare(a.title);
          case SortOption.DateNewest:
          default:
            return (
              new Date(b.uploadDate).getTime() -
              new Date(a.uploadDate).getTime()
            );
        }
      });
  }, [photos, filterStatus, searchTerm, sortOption]);

  const renderView = () => {
    const props = {
      photos: filteredAndSortedPhotos,
      onSelectPhoto: setSelectedPhoto,
      onToggleApproval: handleToggleApproval,
      onToggleSelection: handleToggleSelection,
      selectedIds: selectedIds,
    };
    switch (viewMode) {
      case ViewMode.List:
        return <PhotoList {...props} />;
      case ViewMode.Card:
        return <PhotoCardView {...props} />;
      case ViewMode.Grid:
      default:
        return <PhotoGrid {...props} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg">Loading photos from Google Sheets...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-lg mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Error Loading Photos</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={handleRefresh}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Make sure you have:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Set up your Google Sheets API key</li>
                  <li>Configured the correct spreadsheet ID</li>
                  <li>Made your spreadsheet publicly readable</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortOption={sortOption}
        onSortChange={setSortOption}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        theme={theme}
        onThemeToggle={handleToggleTheme}
        selectedCount={selectedIds.size}
        onBulkApprove={() => handleBulkOperation(true)}
        onBulkReject={() => handleBulkOperation(false)}
        onClearSelection={() => setSelectedIds(new Set())}
        onRefresh={handleRefresh}
      />
      <main className="max-w-screen-2xl mx-auto">{renderView()}</main>
      <PhotoDetailsPanel
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onToggleApproval={handleToggleApproval}
      />
    </div>
  );
};

export default App;
