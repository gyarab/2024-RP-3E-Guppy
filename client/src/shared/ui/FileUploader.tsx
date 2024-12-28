import { useRef } from "react";
import Button from "./Button";

interface FileUploaderProps {
  onFileChange: (files: File[]) => void;
  accept?: string;
}

function FileUploader({ onFileChange, accept = "*" }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(Array.from(event.target.files || []));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        ref={fileInputRef}
        className="file-uploader__input"
        onChange={handleFileChange}
        accept={accept}
      />

      <Button
        onClick={openFileDialog}
        additionalClasses="file-uploader__button"
        variant="basic"
        aria-label="Upload file"
        size="small"
      >
        <img src="/icons/paperclip.svg" alt="Upload icon" />
      </Button>
    </div>
  );
}

export default FileUploader;
