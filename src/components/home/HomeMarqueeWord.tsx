export function HomeMarqueeWord({
  word,
  variant,
}: {
  word: string;
  variant: "solid" | "hollow";
}) {
  if (variant === "solid") {
    return <span className="auth-wallhack-word auth-wallhack-word--solid">{word}</span>;
  }

  return (
    <span className="auth-wallhack-word auth-wallhack-word--hollow">
      {word.split("").map((char, index) =>
        char === "R" ? (
          <span key={`${char}-${index}`} className="home-marquee-letter-solid">
            {char}
          </span>
        ) : (
          char
        ),
      )}
    </span>
  );
}
