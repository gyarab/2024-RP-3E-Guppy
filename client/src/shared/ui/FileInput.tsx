import { useRef, useState } from "react";

import { formatFileSize } from "../utils/formatFileSize";
import Button from "./Button";

interface FileInputProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

function FileInput({ onFileSelect, accept, multiple = false }: FileInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allFiles = multiple ? [...selectedFiles, ...files] : files;
    setSelectedFiles(allFiles);
    onFileSelect(allFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    const allFiles = multiple ? [...selectedFiles, ...files] : files;
    setSelectedFiles(allFiles);
    onFileSelect(allFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    onFileSelect([]);
  };

  return (
    <div
      className={`file-input ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        type="file"
        className="file-input__input"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        ref={fileInputRef}
      />
      <div className="file-input__label">
        <p>
          {selectedFiles.length > 0
            ? "File(s) ready to upload"
            : "Drag & Drop files here or click to browse"}
        </p>
        {selectedFiles.length > 0 && multiple && (
          <Button
            additionalClasses="file-input__clear"
            onClick={(e) => {
              e.stopPropagation();
              clearAllFiles();
            }}
          >
            Clear all
          </Button>
        )}
      </div>
      {selectedFiles.length > 0 && (
        <ul className="file-input__preview">
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} ({formatFileSize(file.size)})
              <button
                className="file-input__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <img src="/icons/cross.svg" alt="Delete icon" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileInput;
