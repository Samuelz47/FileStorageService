import React, { useEffect } from 'react';
import { DocumentRecord } from '../../types';

interface FilePreviewProps {
    file: DocumentRecord | null;
    onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
    // Permite fechar o modal pressionando a tecla "Esc"
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (file) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [file, onClose]);

    if (!file) return null;

    const type = file.type.toLowerCase();
    const isImage = type.includes('image') || type.includes('jpg') || type.includes('jpeg') || type.includes('png');
    const isPDF = type.includes('pdf');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm sm:p-6 transition-opacity"
            onClick={onClose}
        >
            {/* Container Principal do Modal */}
            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()} // Previne fechamento caso clique no interior do modal
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                    <h3 className="text-lg font-semibold text-slate-800 truncate pr-4" title={file.name}>
                        {file.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                        aria-label="Fechar visualização"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Área de Renderização (Corpo do Modal) */}
                <div className="flex-1 overflow-auto bg-slate-50/50 p-6 flex flex-col items-center justify-center min-h-[50vh]">
                    {isImage && (
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={file.url}
                                alt={`Pré-visualização de ${file.name}`}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm border border-slate-200 bg-white"
                            />
                        </div>
                    )}

                    {isPDF && (
                        <div className="w-full h-full flex flex-col items-center gap-6">
                            <iframe
                                src={file.url}
                                title={file.name}
                                className="w-full h-[65vh] rounded-md border border-slate-200 shadow-sm bg-white"
                            />
                            <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="inline-flex items-center px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg shadow hover:shadow-md transition-all"
                            >
                                Abrir PDF em nova guia
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                        </div>
                    )}

                    {!isImage && !isPDF && (
                        <div className="text-center py-12">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4 ring-1 ring-slate-200">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-800">Pré-visualização não disponível</h3>
                            <p className="text-slate-500 mt-1 mb-6">Não é possível gerar uma prévia para este formato de arquivo no navegador.</p>
                            <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="inline-flex items-center px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all"
                            >
                                Fazer Download do Arquivo
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
