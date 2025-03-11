"use client";

import { uploadFileToPinata } from "@/services/ipfsService";
import { toast } from "react-hot-toast";
import { FileInput, Loading } from "react-daisyui";
import React, { useState } from "react";
import { useField } from "formik";

interface UploadImageFormProps {
  /**
   * Optional callback if parent wants the file + IPFS hash for additional logic.
   * If not provided, we only set the Formik field value.
   */
	onFileUploaded?: (file: File, ipfsHash: string) => void;
	fileHashIpfsName?: string;
	fileHashIpfsId?: string;
}

/**
 * This component:
 * - Ties into Formik fields "buildingImageIpfsId" & "buildingImageIpfsFile"
 * - Allows selecting a file, then uploads it to Pinata
 * - On success, sets "buildingImageIpfsId" to the returned IPFS hash
 * - If `onFileUploaded` is provided, also calls it with file + hash
 */
export function UploadImageForm({ onFileUploaded, fileHashIpfsId = "buildingImageIpfsId", fileHashIpfsName = "buildingImageIpfsFile"}: UploadImageFormProps) {
  // Ties into Formik fields
  const [_, meta, helpers] = useField(fileHashIpfsId);
  const [, fileMeta, fileHelpers] = useField(fileHashIpfsName);

  const [isUploading, setIsUploading] = useState(false);

  async function uploadImageToIpfs(fileToUpload: File) {
    setIsUploading(true);
    try {
      // Upload to Pinata
      const ipfsHash = await uploadFileToPinata(fileToUpload, `image-${fileToUpload.name}`);

      // Set "buildingImageIpfsId" in Formik
      helpers.setValue(ipfsHash);

      // Optionally call parent's callback
      if (onFileUploaded) {
        onFileUploaded(fileToUpload, ipfsHash);
      }

      setIsUploading(false);
    } catch (e) {
      console.error(e);
      toast.error("Image file upload to IPFS failed");
      fileHelpers.setError("Image file upload to IPFS failed");
      setIsUploading(false);
    }
  }

  return (
    <>
      <label className="label" htmlFor={fileHashIpfsName}>
        <span className="label-text">Or upload new image to IPFS</span>
      </label>

      <FileInput
        name={fileHashIpfsName}
        color="primary"
        className="text-primary"
        onChange={(event) => {
          if (event.currentTarget.files && event.currentTarget.files.length > 0) {
            uploadImageToIpfs(event.currentTarget.files[0]);
          }
        }}
      />
      <label className="label" htmlFor={fileHashIpfsName}>
        {fileMeta.error && (
          <span className="label-text-alt text-red-700">{fileMeta.error}</span>
        )}
      </label>

      {isUploading && <Loading />}
    </>
  );
}
