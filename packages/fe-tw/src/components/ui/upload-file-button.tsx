import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface IProps {
   isLoading?: boolean;
   onFileAdded: (file: File) => void;
}

function UploadFileButton({ isLoading, onFileAdded }: IProps) {
   const ref = useRef<HTMLInputElement>(null);

   const handleFileChange = async (e) => {
      const file = e.target.files[0];
      onFileAdded(file);
   };

   return (
      <Button
         isLoading={isLoading}
         disabled={isLoading}
         type="button"
         title="Upload image"
         variant="outline"
         onClick={() => ref.current.click()}
      >
         {!isLoading && <Upload />}
         <input ref={ref} type="file" className="hidden" onChange={handleFileChange} />
      </Button>
   );
}

export { UploadFileButton };
