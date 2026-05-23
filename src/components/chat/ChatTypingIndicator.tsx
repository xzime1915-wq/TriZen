export function ChatTypingIndicator({ text }: { text: string }) {
  return (
    <p
      className="px-1 py-1 text-xs italic text-zinc-500 tracking-wide"
      aria-live="polite"
    >
      {text}
    </p>
  );
}
