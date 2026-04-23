"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string[];
  disabled?: boolean;
}

export function UploadDropzone({
  value,
  onChange,
  accept = ["image/jpeg", "image/png", "image/webp"],
  disabled,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      if (!f) return;
      onChange(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: Object.fromEntries(accept.map((m) => [m, []])),
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
  });

  if (value && preview) {
    return (
      <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-border p-4">
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="truncate font-medium">{value.name}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {(value.size / 1024 / 1024).toFixed(2)} MB · {value.type}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange(null);
              setPreview(null);
            }}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/50",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <input {...getInputProps()} />
      <Upload className={cn("h-10 w-10 mb-3", isDragActive ? "text-primary" : "text-muted-foreground")} />
      <p className="font-medium">
        {isDragActive ? "Drop your image here" : "Drop an image or click to browse"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP — up to 10 MB</p>
    </div>
  );
}
