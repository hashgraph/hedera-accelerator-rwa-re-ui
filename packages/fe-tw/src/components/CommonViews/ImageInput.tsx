import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/formInput";
import { UploadFileButton } from "@/components/ui/upload-file-button";
import { cx } from "class-variance-authority";
import React from "react";

export enum InputEntity {
    Building = 'Building',
    Slice = 'Slice',
}

interface ImageInputProps {
    ipfsId: string;
    file: File | null | undefined;
    onChange: (args: { id: string; file: File | null }) => void;
    error?: string;
    touched?: boolean;
    inputEntity: InputEntity;
}

const ImageInput = React.memo(
   ({ ipfsId, file, inputEntity, error, touched, onChange }: ImageInputProps) => {
        const [imagePreview, setImagePreview] = useState<string | null>(null);

        useEffect(() => {
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else if (ipfsId) {
                setImagePreview(`https://ipfs.io/ipfs/${ipfsId}`);
            } else {
                setImagePreview(null);
            }
        }, [file, ipfsId]);

        const clearImage = () => {
            onChange({ id: "", file: null });
            setImagePreview(null);
        };

        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-2 items-start">
                    <FormInput
                        required
                        disabled={!!file}
                        label={`${inputEntity} Image IPFS Id`}
                        name={`info.${inputEntity}ImageIpfsId`}
                        value={ipfsId}
                        onChange={(e) => {
                            const newId = e.target.value.trim();
                            onChange({ id: newId, file: null });
                        }}
                        placeholder="QmXYZ..."
                        error={touched ? error : undefined}
                    />
                    <UploadFileButton
                        className={cx("mt-4.5", error && touched && "border-red-500")}
                        onFileAdded={(uploadedFile) => {
                            onChange({ id: "", file: uploadedFile });
                        }}
                    />
                </div>

                <div
                    className={cx(
                        "relative overflow-hidden w-full h-64 border-2 rounded-lg flex items-center justify-center bg-gray-50",
                        imagePreview ? "border-gray-300" : "border-dashed border-gray-400",
                        error && touched && "border-red-500 border-dashed",
                    )}
                >
                {imagePreview ? (
                    <>
                        <div className="relative w-full h-full">
                            <Image
                                src={imagePreview}
                                alt={`${inputEntity} preview`}
                                fill
                                className="object-cover"
                                onError={() => setImagePreview(null)}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            size="icon"
                            type="button"
                            onClick={clearImage}
                            className={cx("absolute top-2 right-2 size-8")}
                            aria-label="Clear image"
                        >
                            <Trash size={16} />
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} />
                        <p className="mt-2 text-sm">No image selected</p>
                    </div>
                )}
                </div>
            </div>
        );
   },
);

export default ImageInput;
