"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { IMAGE_TYPES, validateImages } from "./attachments";

function ImagePreview({ file }: { file: File }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? <Image src={url} alt={`Attachment preview: ${file.name}`} width={96} height={72} unoptimized /> : null;
}

export function MessageAttachments({ files, onChange, disabled }: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="contact-attachments">
      <div className="contact-attachments-toolbar">
        <label className="contact-attachment-picker" aria-disabled={disabled}>
          <Paperclip size={18} aria-hidden="true" /> Add images
          <input
            className="sr-only"
            type="file"
            multiple
            accept={IMAGE_TYPES.join(",")}
            disabled={disabled}
            aria-describedby="contact-images-help contact-images-error"
            onChange={(event) => {
              const next = [...files, ...Array.from(event.target.files ?? [])];
              const issue = validateImages(next);
              setError(issue);
              if (!issue) onChange(next);
              event.target.value = "";
            }}
          />
        </label>
        <span id="contact-images-help">Up to 5 images · 5 MB each<br />JPG, PNG, WebP, GIF</span>
      </div>
      <div id="contact-images-error" role="alert">
        {error && <p className="field-error">{error}</p>}
      </div>
      {files.length > 0 && (
        <ul className="contact-attachment-list" aria-label="Attached images">
          {files.map((file, index) => (
            <li key={`${file.name}-${file.lastModified}-${index}`}>
              <ImagePreview file={file} />
              <span className="contact-attachment-name">{file.name}</span>
              <button type="button" disabled={disabled} aria-label={`Remove ${file.name}`} onClick={() => {
                onChange(files.filter((_, position) => position !== index));
                setError(null);
              }}><X size={16} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
