import { useRef, useState } from "react";
import { formatFileSize } from "../utils/formatFileSize";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
}

function FileUploader({
  onFileChange,
  accept = "*",
  maxSize = 5 * 1024 * 1024,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileChange(file);
      setError(null);
    }
  };

  // Validate the file size
  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(
        `The file exceeds the size limit of ${formatFileSize(maxSize)}.`
      );
      return false;
    }
    return true;
  };

  // Open the file dialog when the button is clicked
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Remove the selected file
  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
  };

  return (
    <div className="file-uploader">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="file-uploader__input"
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }} // Hiding the file input
      />

      {/* Button to trigger the file dialog */}
      <button
        className="file-uploader__button"
        onClick={openFileDialog}
        aria-label="Upload file"
        type="button"
      >
        <img src="/icons/paperclip.svg" alt="Upload icon" />
      </button>

      {/* Display selected file information and remove button */}
      {selectedFile && (
        <div className="file-uploader__file">
          <span>{selectedFile.name}</span>
          <button onClick={removeFile}>Remove</button>
        </div>
      )}

      {/* Display error message if file validation fails */}
      {error && <div className="file-uploader__error">{error}</div>}
    </div>
  );
}

export default FileUploader;

interface ImagePreviewProps {
  file: File;
}

function ImagePreview({ file }: ImagePreviewProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const reader = new FileReader();
  reader.onload = (e) => {
    setImageSrc(e.target?.result as string);
  };
  reader.readAsDataURL(file);

  return (
    <div className="image-preview">
      {imageSrc ? (
        <img src={imageSrc} alt={file.name} className="image-preview__img" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
