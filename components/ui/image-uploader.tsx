"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploaderProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative rounded-md overflow-hidden mb-3">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <CldImage
              width="280"
              height="200"
              style={{ objectFit: "fill", objectPosition: "center" }}
              src={url}
              alt="Billboard image"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="qr6i5lru">
        {({ open }) => {
          const onClick = () => {
            // enables interaction with upload model from cloudinary
            document.body.style.pointerEvents = "auto";
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              className="w-full sm:w-[200px]"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
