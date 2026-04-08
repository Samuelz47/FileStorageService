import React from 'react';
import { DocumentRecord } from '../../types';
import { formatBytes, formatDateBR } from '../../utils/formatters';

interface FileTableProps {
    files: DocumentRecord[];
    onSelectFile: (file: DocumentRecord) => void;
}

export const FileTable: React.FC<FileTableProps> = ({ files, onSelectFile }) => {
    if (!files || files.length === 0) {
        return (
            <div className="w-full p-12 bg-white rounded-xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-700">Nenhum arquivo enviado ainda</h3>
                <p className="text-sm text-slate-500 mt-1">Faça o upload de documentos para visualizá-los aqui.</p>
            </div>
        );
    }

    const handleDownload = async (file: DocumentRecord) => {
        try {
            const response = await fetch(file.url);
            if (!response.ok) throw new Error('Não foi possível estabelecer stream para baixar o arquivo.');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = blobUrl;
            link.download = file.name;

            document.body.appendChild(link);
            link.click();

            // Cleanup de memória
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Falha no download direto. Utilizando a nova guia como Fallback:', error);
            window.open(file.url, '_blank');
        }
    };

    const renderTypeBadge = (type: string) => {
        const typeLabel = type.toLowerCase();
        const isPDF = typeLabel.includes('pdf');
        const isImage = typeLabel.includes('image') || typeLabel.includes('jpg') || typeLabel.includes('png') || typeLabel.includes('jpeg');

        if (isPDF) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                    PDF
                </span>
            );
        }

        if (isImage) {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                    Imagem
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                Outro
            </span>
        );
    };

    return (
        <div className="w-full mt-6 overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-xl">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                        <tr>
                            <th scope="col" className="py-4 pl-4 pr-3 text-left text-sm font-semibold text-slate-600 sm:pl-6">
                                Nome do Arquivo
                            </th>
                            <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-600">
                                Tipo
                            </th>
                            <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-600">
                                Tamanho
                            </th>
                            <th scope="col" className="px-3 py-4 text-left text-sm font-semibold text-slate-600">
                                Data de Upload
                            </th>
                            <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Ações</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {files.map((file) => (
                            <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                                    {file.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                    {renderTypeBadge(file.type)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                                    {formatBytes(file.size)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                                    {formatDateBR(file.createdAt)}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onSelectFile(file)}
                                            className="inline-flex items-center text-sky-700 hover:text-sky-900 font-semibold bg-sky-50 px-3 py-2 rounded-lg hover:bg-sky-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            Visualizar
                                        </button>
                                        <button
                                            onClick={() => handleDownload(file)}
                                            className="inline-flex items-center text-slate-700 hover:text-slate-900 font-semibold bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                                            title="Baixar Arquivo Imediatamente"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                            </svg>
                                            Download
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
