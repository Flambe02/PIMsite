import React, { useRef, useState } from "react";

export default function MobileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProgress(0);
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setProgress(30);
    setTimeout(() => setProgress(100), 1200); // Simule l'upload
  };

  const handleRetry = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    inputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4" data-testid="mobile-upload">
      <h1 className="text-xl font-bold mb-4">Uploader votre Holerite</h1>
      <p className="text-base text-center mb-6">Sélectionnez un fichier PDF ou une photo de votre holerite.</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={handleFileChange}
        data-testid="file-input"
      />
      {!file ? (
        <button
          className="w-full max-w-xs h-12 bg-blue-600 text-white rounded font-bold mb-4"
          onClick={() => inputRef.current?.click()}
          data-testid="select-file"
        >
          Choisir un fichier
        </button>
      ) : (
        <div className="w-full max-w-xs flex flex-col items-center">
          <span className="mb-2 text-sm">{file.name}</span>
          <button
            className="w-full h-12 bg-green-600 text-white rounded font-bold mb-4"
            onClick={handleUpload}
            data-testid="upload-btn"
          >
            Envoyer
          </button>
          <div className="w-full bg-gray-200 rounded h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }} />
          </div>
          {progress === 100 && <span className="text-green-600">Upload réussi !</span>}
          {error && <span className="text-red-600">{error}</span>}
          <button
            className="w-full h-10 bg-gray-300 text-gray-800 rounded font-bold mt-2"
            onClick={handleRetry}
            data-testid="retry-btn"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
} 