"use client";

import { useRef, useState } from "react";
import { ImagePlus, Mic, Send, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  placeholder?: string;
  onSendText: (text: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  onTyping?: () => void;
};

export function ChatComposer({
  disabled,
  placeholder = "Type a message…",
  onSendText,
  onUploadFile,
  onTyping,
}: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastTypingPing = useRef(0);

  function pingTyping() {
    if (!onTyping || disabled) return;
    const now = Date.now();
    if (now - lastTypingPing.current < 2000) return;
    lastTypingPing.current = now;
    onTyping();
  }

  async function handleSend() {
    const value = text.trim();
    if (!value || sending || disabled) return;
    setSending(true);
    try {
      await onSendText(value);
      setText("");
    } finally {
      setSending(false);
    }
  }

  async function handleImage(file: File) {
    setUploading(true);
    try {
      await onUploadFile(file);
    } finally {
      setUploading(false);
    }
  }

  async function startRecording() {
    if (disabled || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (blob.size > 0) {
          setUploading(true);
          try {
            const file = new File([blob], `voice-${Date.now()}.webm`, {
              type: blob.type || "audio/webm",
            });
            await onUploadFile(file);
          } finally {
            setUploading(false);
          }
        }
        setRecording(false);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      alert("Microphone access is required for voice messages.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
  }

  const busy = sending || uploading;

  return (
    <div className="border-t border-[var(--color-border)] bg-black p-3">
      {(recording || uploading) && (
        <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
          {recording ? "Recording… tap stop when done" : "Uploading…"}
        </p>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={imageRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void handleImage(file);
          }}
        />
        <button
          type="button"
          disabled={disabled || busy || recording}
          onClick={() => imageRef.current?.click()}
          className="trizen-chat-tool-btn"
          aria-label="Send photo"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <button
          type="button"
          disabled={disabled || busy}
          onClick={() => (recording ? stopRecording() : void startRecording())}
          className={cn("trizen-chat-tool-btn", recording && "text-red-400")}
          aria-label={recording ? "Stop recording" : "Voice message"}
        >
          {recording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            pingTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleSend();
            }
          }}
          disabled={disabled || busy || recording}
          placeholder={placeholder}
          autoComplete="off"
          className="trizen-chat-input h-11 flex-1 min-w-0"
        />
        <button
          type="button"
          disabled={disabled || busy || recording || !text.trim()}
          onClick={() => void handleSend()}
          className="trizen-chat-send-btn"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
