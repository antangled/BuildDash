'use client';

import { useCallback, useState } from 'react';
import { Upload, FileUp, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseSTLFile, formatFileSize } from '@/lib/stl-parser';
import { useBuyerStore } from '@/store/useBuyerStore';
import type { BufferGeometry } from 'three';

interface STLUploaderProps {
  onGeometryLoaded?: (geometry: BufferGeometry) => void;
}

export default function STLUploader({ onGeometryLoaded }: STLUploaderProps) {
  const { stlFile, stlInfo, setSTLFile, setSTLInfo, clearSearch } = useBuyerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Please upload a .stl file');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File too large (max 100MB)');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const { info, geometry } = await parseSTLFile(file);
      setSTLFile(file);
      setSTLInfo(info);
      onGeometryLoaded?.(geometry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse STL file');
    } finally {
      setIsLoading(false);
    }
  }, [setSTLFile, setSTLInfo, onGeometryLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = useCallback(() => {
    clearSearch();
    setError(null);
  }, [clearSearch]);

  if (stlInfo) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <FileUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">{stlInfo.fileName}</p>
              <p className="text-sm text-green-700">
                {formatFileSize(stlInfo.fileSize)} &middot; {stlInfo.triangleCount.toLocaleString()} triangles
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragging
          ? 'border-orange-400 bg-orange-50'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
      }`}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm text-slate-600">Parsing STL file...</p>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-3 font-medium text-slate-700">
            Drop your STL file here
          </p>
          <p className="mt-1 text-sm text-slate-500">
            or click to browse (max 100MB)
          </p>
          <input
            type="file"
            accept=".stl"
            onChange={handleInputChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
