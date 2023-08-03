"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploaderProps {
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  disabled?: boolean;
  labelPreview?: string;
  labelPreviewColor?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onChange,
  onRemove,
  value,
  disabled,
  labelPreview,
  labelPreviewColor,
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
          <div
            key={url}
            className="relative h-40 w-full rounded-md overflow-hidden mb-3"
          >
            <div className="z-10 absolute top-2 right-2 ">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute w-full h-full  aspect-h-1 bg-gray-200 rounded-lg ">
              <Image
                priority={true}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={url}
                alt={"Billboard image preview"}
                quality={25}
              />
              <div className="flex justify-center items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full px-10">
                <p
                  className={cn("text-center select-none")}
                  style={{ color: labelPreviewColor && labelPreviewColor }}
                >
                  {labelPreview}
                </p>
              </div>
            </div>
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
