import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadFile } from '../../services/api';

interface FileUploadProps {
    onUploadSuccess: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await handleUpload(file);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            await handleUpload(file);
        }
    };

    const triggerFileSelect = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const validateFile = (file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            return `O arquivo "${file.name}" não é aceito. Por favor, envie apenas documentos JPG, PNG ou PDF.`;
        }
        return null;
    };

    const handleUpload = async (file: File) => {
        const errorMsg = validateFile(file);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            await uploadFile(file);
            onUploadSuccess();

            // Limpa o input file caso o usuário queira enviar o mesmo arquivo novamente
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao fazer o upload do arquivo. Tente novamente mais tarde.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-6">
            <div
                className={`w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[260px]
          ${isDragActive ? 'border-sky-500 bg-sky-50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
          ${isUploading ? 'opacity-80 cursor-wait' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                    onChange={handleChange}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <svg className="animate-spin h-10 w-10 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-700 font-medium animate-pulse">Fazendo upload do arquivo...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                        <div className="p-4 bg-white rounded-full shadow-sm ring-1 ring-slate-200">
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-800">Clique ou arraste e solte o arquivo aqui</p>
                            <p className="text-sm text-slate-500 mt-1">Apenas arquivos JPG, PNG ou PDF</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};
