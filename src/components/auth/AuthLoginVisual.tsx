const AUTH_LOGIN_WORD_COUNT = 14;

function AuthLoginWords({
  idPrefix,
  word,
  wordCount = AUTH_LOGIN_WORD_COUNT,
}: {
  idPrefix: string;
  word: string;
  wordCount?: number;
}) {
  return Array.from({ length: wordCount }, (_, index) => {
    const variant = index % 2 === 0 ? "solid" : "hollow";
    return (
      <p
        key={`${idPrefix}-${variant}-${index}`}
        className={`auth-wallhack-word auth-wallhack-word--${variant}`}
      >
        {word}
      </p>
    );
  });
}

export function AuthLoginVisual({
  word = "Login",
  wordCount = AUTH_LOGIN_WORD_COUNT,
}: {
  word?: string;
  wordCount?: number;
}) {
  return (
    <div className="auth-wallhack-marquee">
      <div className="auth-wallhack-marquee-track">
        <div className="auth-wallhack-wordstack">
          <AuthLoginWords idPrefix="a" word={word} wordCount={wordCount} />
        </div>
        <div className="auth-wallhack-wordstack" aria-hidden>
          <AuthLoginWords idPrefix="b" word={word} wordCount={wordCount} />
        </div>
      </div>
    </div>
  );
}
