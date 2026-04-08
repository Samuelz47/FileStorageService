import { DocumentRecord } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/Files';

export const uploadFile = async (file: File): Promise<DocumentRecord> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Upload failed with status: ${response.status}`);
        }

        const data: DocumentRecord = await response.json();
        return data;
    } catch (error) {
        console.error('Network error during file upload:', error);
        throw error;
    }
};

export const getFiles = async (): Promise<DocumentRecord[]> => {
    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`Failed to fetch files. Status: ${response.status}`);
        }

        const data: DocumentRecord[] = await response.json();
        return data;
    } catch (error) {
        console.error('Network error fetching files:', error);
        throw error;
    }
};

export const getFileById = async (id: string): Promise<DocumentRecord | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch file by ID. Status: ${response.status}`);
        }

        const data: DocumentRecord = await response.json();
        return data;
    } catch (error) {
        console.error(`Network error fetching file with id ${id}:`, error);
        throw error;
    }
};
