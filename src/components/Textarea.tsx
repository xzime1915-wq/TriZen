import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

export function Textarea({
  className,
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block">
      {label ? <span className="trizen-box-label">{label}</span> : null}
      <textarea
        className={cn(
          "trizen-box-field min-h-[100px] resize-y normal-case tracking-normal text-sm placeholder:normal-case placeholder:tracking-normal",
          className
        )}
        {...props}
      />
    </label>
  );
}
