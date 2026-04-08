import { useState, useEffect, useCallback } from 'react';
import { FileUpload } from './components/Upload/FileUpload';
import { FileTable } from './components/FileList/FileTable';
import { FilePreview } from './components/Preview/FilePreview';
import { getFiles } from './services/api';
import { DocumentRecord } from './types';

function App() {
    const [files, setFiles] = useState<DocumentRecord[]>([]);
    const [selectedFile, setSelectedFile] = useState<DocumentRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getFiles();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar a lista de arquivos. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carrega a lista quando a aplicação é montada
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Cabeçalho */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg className="w-8 h-8 text-sky-600 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                        </svg>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Gerenciador de Arquivos</h1>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Dashboard</div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* Seção de Upload */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="mb-2">
                        <h2 className="text-xl font-semibold text-slate-800">Enviar Novo Documento</h2>
                        <p className="text-sm text-slate-600 mt-1">Faça o upload dos seus arquivos e documentos PDF ou Imagens.</p>
                    </div>
                    <FileUpload onUploadSuccess={fetchFiles} />
                </section>

                {/* Seção da Lista de Arquivos */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Seus Arquivos</h2>
                            <p className="text-sm text-slate-600 mt-1">Visualize e acesse os documentos que você já enviou.</p>
                        </div>
                        <button
                            onClick={fetchFiles}
                            disabled={isLoading}
                            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors disabled:opacity-50"
                            aria-label="Atualizar lista"
                        >
                            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="w-full flex justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
                            <div className="flex flex-col items-center space-y-4">
                                <svg className="animate-spin h-8 w-8 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-slate-500 font-medium tracking-wide">Carregando arquivos...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            {error}
                        </div>
                    ) : (
                        <FileTable files={files} onSelectFile={(file) => setSelectedFile(file)} />
                    )}
                </section>

            </main>

            {/* Modal de Preview (Renderizado apenas se selectedFile tiver algum arquivo) */}
            {selectedFile && (
                <FilePreview
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
}

export default App;
