import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";

const inputBase =
  "w-full bg-transparent border-b py-3 focus:outline-none transition-colors text-lg font-serif";
const inputBorderIdle = "border-border focus:border-gold";
const inputBorderError = "border-red-500 focus:border-red-500";
const labelClass =
  "text-[10px] uppercase tracking-widest font-bold text-foreground/40";
const errorClass = "text-red-500 text-sm font-medium";

interface FormFieldProps {
  label: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** A labeled form row that renders its control and an optional inline error. */
export const FormField = ({
  label,
  error,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn("space-y-2", className)}>
    <label className={labelClass}>{label}</label>
    {children}
    {error && <p className={errorClass}>{error}</p>}
  </div>
);

/** Text input styled to the app's underlined field convention. */
export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={error || undefined}
    className={cn(
      inputBase,
      error ? inputBorderError : inputBorderIdle,
      className,
    )}
    {...props}
  />
));
TextInput.displayName = "TextInput";

/** Textarea variant of {@link TextInput}. */
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={error || undefined}
    className={cn(
      inputBase,
      "resize-none",
      error ? inputBorderError : inputBorderIdle,
      className,
    )}
    {...props}
  />
));
TextArea.displayName = "TextArea";
