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
  return `${digits.slice(0, 3)}<span style="color:#d4d4d8;padding:0 6px;">&middot;</span>${digits.slice(3)}`;
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
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e4e4e7;">
            <tr>
              <td style="padding:28px 32px 24px;border-bottom:1px solid #e4e4e7;text-align:center;">
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;color:#71717a;">
                  ${eyebrow}
                </p>
                <div style="margin:0;text-align:center;">
                  ${trizenBrandHtml({ fontSize: "28px" })}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 28px;text-align:center;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#52525b;">
                  ${intro}
                </p>
                <p style="margin:0 auto 28px;max-width:320px;padding:12px 16px;border:1px solid #e4e4e7;background:#fafafa;font-size:14px;line-height:1.5;color:#18181b;word-break:break-all;">
                  ${email}
                </p>
                <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#71717a;">
                  ${codeLabel}
                </p>
                <p style="margin:0 auto 24px;display:inline-block;padding:18px 28px;border:2px solid #18181b;background:#ffffff;font-size:34px;line-height:1;font-weight:700;letter-spacing:0.18em;color:#18181b;font-variant-numeric:tabular-nums;">
                  ${formatCodeDigits(code)}
                </p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;">
                  Expires in ${expiryMinutes} minutes
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 24px;border-top:1px solid #e4e4e7;background:#fafafa;text-align:center;">
                <p style="margin:0 0 8px;font-size:12px;line-height:1.55;color:#71717a;">
                  If you did not request this code, you can ignore this email.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.55;color:#a1a1aa;">
                  <a href="${SITE_URL}" style="color:#18181b;text-decoration:none;font-weight:600;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
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
  return [
    SITE_NAME.toUpperCase(),
    "",
    intro,
    email,
    "",
    codeLabel,
    code,
    "",
    `Expires in ${expiryMinutes} minutes.`,
    "",
    "If you did not request this code, you can ignore this email.",
    SITE_URL,
    "support@trizenstore.com.bd",
  ].join("\n");
}
