
import React, { useEffect, useState } from 'react';
import { Photo } from '../types';
import { CloseIcon, CheckCircleIcon, ClockIcon } from './icons';

interface PhotoDetailsPanelProps {
    photo: Photo | null;
    onClose: () => void;
    onToggleApproval: (id: string, approved: boolean) => void;
}

const PhotoDetailsPanel: React.FC<PhotoDetailsPanelProps> = ({ photo, onClose, onToggleApproval }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!photo) return;
        setIsClosing(false);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photo]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // match animation duration
    };

    if (!photo) return null;

    const animationClass = isClosing ? 'animate-slideOut' : 'animate-slideIn';

    const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-md text-slate-800 dark:text-slate-200">{value}</p>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={handleClose}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-100 dark:bg-slate-900 shadow-2xl z-50 flex flex-col ${animationClass}`}>
                <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate" title={photo.title}>{photo.title}</h2>
                    <button onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto">
                    <div className="p-6">
                        <img src={photo.url} alt={photo.title} className="w-full rounded-lg shadow-md mb-6"/>
                        
                        <div className="mb-6">
                             <button
                                onClick={() => onToggleApproval(photo.id, !photo.approved)}
                                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-bold transition-colors ${photo.approved ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900'}`}
                            >
                                {photo.approved ? <CheckCircleIcon className="w-6 h-6 mr-2" /> : <ClockIcon className="w-6 h-6 mr-2" />}
                                {photo.approved ? 'Approved' : 'Pending Approval'}
                            </button>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6">{photo.description}</p>
                        
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label="Photographer" value={photo.photographer} />
                                <DetailItem label="Upload Date" value={new Date(photo.uploadDate).toLocaleString()} />
                                <DetailItem label="Camera" value={photo.metadata.camera} />
                                <DetailItem label="Lens" value={photo.metadata.lens} />
                                <DetailItem label="Aperture" value={photo.metadata.aperture} />
                                <DetailItem label="Shutter Speed" value={photo.metadata.shutterSpeed} />
                                <DetailItem label="ISO" value={photo.metadata.iso} />
                            </div>
                        </div>

                         <div className="mt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {photo.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PhotoDetailsPanel;
