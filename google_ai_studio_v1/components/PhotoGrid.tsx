import React from 'react';
import { Photo } from '../types';

interface PhotoItemProps {
    photo: Photo;
    onSelectPhoto: (photo: Photo) => void;
    onToggleApproval: (id: string, approved: boolean) => void;
    onToggleSelection: (id: string) => void;
    isSelected: boolean;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onSelectPhoto, onToggleApproval, onToggleSelection, isSelected }) => {
    const handleCheckboxClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onToggleApproval(photo.id, !photo.approved);
    };

    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggleSelection(photo.id);
    };

    return (
        <div className="relative group aspect-square overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl cursor-pointer" onClick={() => onSelectPhoto(photo)}>
            <img src={`${photo.url}&grayscale`} alt={photo.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="absolute top-2 left-2 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleSelectionChange}
                    className="form-checkbox h-5 w-5 text-indigo-600 bg-white/30 border-white/50 rounded-sm transition duration-150 ease-in-out focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
                <div className="flex justify-between items-center">
                    <div className="flex-1 overflow-hidden">
                         <h3 className="font-bold truncate">{photo.title}</h3>
                         <p className="text-sm text-slate-300 truncate">{photo.photographer}</p>
                    </div>
                    <div
                        className="ml-2 p-2 rounded-full cursor-pointer transition-colors"
                        onClick={handleCheckboxClick}
                    >
                        {photo.approved ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white" title="Approved">✓</div>
                        ) : (
                            <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center text-white" title="Pending">?</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PhotoGridProps {
    photos: Photo[];
    onSelectPhoto: (photo: Photo) => void;
    onToggleApproval: (id: string, approved: boolean) => void;
    onToggleSelection: (id: string) => void;
    selectedIds: Set<string>;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onSelectPhoto, onToggleApproval, onToggleSelection, selectedIds }) => {
    if (photos.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 mt-8">No photos found.</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
            {photos.map(photo => (
                <PhotoItem
                    key={photo.id}
                    photo={photo}
                    onSelectPhoto={onSelectPhoto}
                    onToggleApproval={onToggleApproval}
                    onToggleSelection={onToggleSelection}
                    isSelected={selectedIds.has(photo.id)}
                />
            ))}
        </div>
    );
};

export default PhotoGrid;