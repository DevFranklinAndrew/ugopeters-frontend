import { useRef, type ChangeEvent } from "react";
import { LuUpload } from "react-icons/lu";
import { cn } from "../../lib/utils";

interface PostCoverImageFieldProps {
  /** A base64 data URL or a hosted one; empty when unset. */
  image: string;
  hasError?: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/** Preview with a hover "Replace" once an image is set, dropzone before that. */
const PostCoverImageField = ({
  image,
  hasError,
  onFileChange,
}: PostCoverImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      {image ? (
        <div className="relative group w-full aspect-video overflow-hidden border border-border">
          <img
            src={image}
            alt="Cover preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={openPicker}
            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest font-bold"
          >
            <LuUpload size={16} />
            Replace image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className={cn(
            "w-full aspect-video flex flex-col items-center justify-center gap-3 border border-dashed transition-colors",
            hasError
              ? "border-red-500/60 text-red-500/80"
              : "border-border text-foreground/40 hover:border-gold hover:text-gold",
          )}
        >
          <LuUpload size={24} />
          <span className="text-xs uppercase tracking-widest font-bold">
            Upload cover image
          </span>
        </button>
      )}
    </>
  );
};

export default PostCoverImageField;
