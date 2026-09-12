import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { UploadWidgetValue } from "@/types";
import { UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const UploadWidget = ({ value = null, onChange, disabled = false }) => {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const onChangeRef = useRef(onChange);

  const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
  const [deleteToken, setDeleteToken] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    setPreview(value);
    if (!value) setDeleteToken(null);
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const initializeWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false; // does cloudinary exist? || or did we already create it? (if yes no need to create another one)

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          multiple: false,
          folder: "uploads",
          maxFileSize: 500000,
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
        (error, result) => {
          if (!error && result.event === "success") {
            const payload: UploadWidgetValue = {
              url: result.info.secure_url,
              publicId: result.info.public_id,
            };

            setPreview(payload);
            setDeleteToken(result.info.delete_token ?? null);

            onChangeRef.current?.(payload);
          }
        },
      );
      return true;
    };
    if (initializeWidget()) return;

    const intervalId = window.setInterval(() => {
      if (initializeWidget()) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  const openWidget = () => {
    if (!disabled) widgetRef.current?.open();
  };

  const removeImageFromCloudinary = async () => {};

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="upload-preview">
            <img src={preview?.url} alt="uploaded image" />
        </div>
      ) : (
        <div
          onClick={openWidget}
          onKeyDown={(e) => {
            if (e.key === "ENTER") {
              e.preventDefault();
              openWidget();
            }
          }}
          className="upload-dropzone"
          role="button"
          tabIndex={0}
        >
          <div className="upload-prompt">
            <UploadCloud className="icon" />
            <div>
              <p>Click to upload photo</p>
              <p>PNG , JPG up 5 mb</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadWidget;
