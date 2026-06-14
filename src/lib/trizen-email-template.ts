import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

type VerificationEmailOptions = {
  eyebrow: string;
  intro: string;
  email: string;
  codeLabel: string;
  code: string;
  expiryMinutes?: number;
};

function formatCodeDigits(code: string) {
  const digits = code.replace(/\D/g, "").padStart(6, "0").slice(0, 6);
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function buildTrizenVerificationEmailHtml({
  eyebrow,
  intro,
  email,
  codeLabel,
  code,
  expiryMinutes = 10,
}: VerificationEmailOptions) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${eyebrow}</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:420px;">
            <tr>
              <td style="padding:0 0 28px;text-align:center;border-bottom:1px solid #e4e4e7;">
                <p style="margin:0 0 10px;font-size:10px;font-weight:400;letter-spacing:0.28em;text-transform:uppercase;color:#a1a1aa;">
                  ${eyebrow}
                </p>
                ${trizenBrandHtml({ fontSize: "26px", email: true })}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 0 24px;text-align:center;">
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#52525b;">
                  ${intro}
                </p>
                <p style="margin:0 0 28px;font-size:14px;line-height:1.5;color:#18181b;word-break:break-all;">
                  ${email}
                </p>
                <p style="margin:0 0 12px;font-size:10px;font-weight:400;letter-spacing:0.22em;text-transform:uppercase;color:#a1a1aa;">
                  ${codeLabel}
                </p>
                <p style="margin:0 auto 20px;display:inline-block;padding:16px 24px;border:1px solid #18181b;background:#ffffff;font-size:32px;line-height:1;font-weight:700;letter-spacing:0.16em;color:#18181b;font-variant-numeric:tabular-nums;">
                  ${formatCodeDigits(code)}
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                  Expires in ${expiryMinutes} minutes
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 0 0;border-top:1px solid #e4e4e7;text-align:center;">
                <p style="margin:0 0 6px;font-size:11px;line-height:1.55;color:#a1a1aa;">
                  If you did not request this code, you can ignore this email.
                </p>
                <p style="margin:0;font-size:11px;line-height:1.55;color:#71717a;">
                  <a href="${SITE_URL}" style="color:#18181b;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:support@trizenstore.com.bd" style="color:#71717a;text-decoration:none;">support@trizenstore.com.bd</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildTrizenVerificationEmailText({
  intro,
  email,
  codeLabel,
  code,
  expiryMinutes = 10,
}: VerificationEmailOptions) {
  const digits = code.replace(/\D/g, "").padStart(6, "0").slice(0, 6);
  const formattedCode = `${digits.slice(0, 3)} ${digits.slice(3)}`;

  return [
    SITE_NAME.toUpperCase(),
    "",
    intro,
    email,
    "",
    codeLabel,
    formattedCode,
    "",
    `Expires in ${expiryMinutes} minutes.`,
    "",
    "If you did not request this code, you can ignore this email.",
    SITE_URL,
    "support@trizenstore.com.bd",
  ].join("\n");
}
