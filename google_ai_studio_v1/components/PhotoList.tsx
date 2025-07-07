
import React from 'react';
import { Photo } from '../types';
import { CheckCircleIcon, ClockIcon } from './icons';

interface PhotoListProps {
    photos: Photo[];
    onSelectPhoto: (photo: Photo) => void;
    onToggleApproval: (id: string, approved: boolean) => void;
    onToggleSelection: (id: string) => void;
    selectedIds: Set<string>;
}

const PhotoList: React.FC<PhotoListProps> = ({ photos, onSelectPhoto, onToggleApproval, onToggleSelection, selectedIds }) => {
    if (photos.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 mt-8">No photos found.</p>;
    }

    const handleRowClick = (photo: Photo) => {
        onSelectPhoto(photo);
    };

    const handleCheckboxClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onToggleSelection(id);
    };
    
    const handleApprovalClick = (e: React.MouseEvent, photo: Photo) => {
        e.stopPropagation();
        onToggleApproval(photo.id, !photo.approved);
    };

    return (
        <div className="p-4 overflow-x-auto">
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg">
                <div className="min-w-full">
                    {/* Header */}
                    <div className="grid grid-cols-[auto_60px_3fr_2fr_2fr_1.5fr_100px] gap-4 px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                        <div></div>
                        <div className="text-center">Image</div>
                        <div>Title</div>
                        <div>Photographer</div>
                        <div>Upload Date</div>
                        <div className="text-center">Status</div>
                        <div className="text-center">Approve</div>
                    </div>
                    {/* Body */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {photos.map(photo => (
                            <div 
                                key={photo.id} 
                                className="grid grid-cols-[auto_60px_3fr_2fr_2fr_1.5fr_100px] gap-4 px-6 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150 cursor-pointer"
                                onClick={() => handleRowClick(photo)}
                            >
                                <div onClick={(e) => handleCheckboxClick(e, photo.id)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(photo.id)}
                                        readOnly
                                        className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-600 border-slate-300 dark:border-slate-500 rounded transition duration-150 ease-in-out focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <img src={`${photo.url}&grayscale&blur=2`} alt={photo.title} className="w-12 h-12 rounded-md object-cover" loading="lazy"/>
                                </div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate" title={photo.title}>{photo.title}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{photo.photographer}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{new Date(photo.uploadDate).toLocaleDateString()}</div>
                                <div className="flex justify-center">
                                    {photo.approved ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <CheckCircleIcon className="w-4 h-4 mr-1"/> Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            <ClockIcon className="w-4 h-4 mr-1" /> Pending
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                      onClick={(e) => handleApprovalClick(e, photo)}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${photo.approved ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500'}`}
                                    >
                                        <span className="text-white text-lg font-bold">{photo.approved ? '✓' : '?'}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoList;
