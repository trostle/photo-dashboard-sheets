import React from 'react';
import { Photo } from '../types';
import { CheckCircleIcon, ClockIcon } from './icons';

interface PhotoCardProps {
    photo: Photo;
    onSelectPhoto: (photo: Photo) => void;
    onToggleApproval: (id: string, approved: boolean) => void;
    onToggleSelection: (id: string) => void;
    isSelected: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onSelectPhoto, onToggleApproval, onToggleSelection, isSelected }) => {
    const handleApprovalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleApproval(photo.id, !photo.approved);
    };

    const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggleSelection(photo.id);
    };

    return (
        <div className="mb-4 break-inside-avoid bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative cursor-pointer" onClick={() => onSelectPhoto(photo)}>
                <img src={photo.url} alt={photo.title} className="w-full h-auto object-cover" loading="lazy" />
                <div className="absolute top-2 left-2 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleSelectionChange}
                        className="form-checkbox h-5 w-5 text-indigo-600 bg-white/30 border-white/50 rounded-sm transition duration-150 ease-in-out focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{photo.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">by {photo.photographer}</p>
                <div className="flex items-center justify-between">
                    {photo.approved ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircleIcon className="w-4 h-4 mr-1" /> Approved
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                           <ClockIcon className="w-4 h-4 mr-1" /> Pending
                        </span>
                    )}
                    <button 
                        onClick={handleApprovalClick}
                        className={`px-3 py-1 text-sm rounded-full font-semibold text-white transition-colors ${photo.approved ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500'}`}
                    >
                        {photo.approved ? 'Approved' : 'Approve'}
                    </button>
                </div>
            </div>
        </div>
    );
};


interface PhotoCardViewProps {
    photos: Photo[];
    onSelectPhoto: (photo: Photo) => void;
    onToggleApproval: (id: string, approved: boolean) => void;
    onToggleSelection: (id: string) => void;
    selectedIds: Set<string>;
}

const PhotoCardView: React.FC<PhotoCardViewProps> = ({ photos, onSelectPhoto, onToggleApproval, onToggleSelection, selectedIds }) => {
    if (photos.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 mt-8">No photos found.</p>;
    }

    return (
        <div className="p-4" style={{ columnCount: 'auto', columnWidth: '280px', columnGap: '1rem' }}>
            {photos.map(photo => (
                 <PhotoCard
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

export default PhotoCardView;