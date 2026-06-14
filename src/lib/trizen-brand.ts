export function trizenBrandHtml({
  fontSize = "28px",
  color = "#18181b",
  suffix = "",
  email = false,
}: {
  fontSize?: string;
  color?: string;
  suffix?: string;
  /** Uniform letter sizing for email clients (no raised T). */
  email?: boolean;
} = {}) {
  if (email) {
    return `<span style="display:inline-block;font-size:${fontSize};font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${color};font-family:Orbitron,'Segoe UI',sans-serif;line-height:1.2;">TRIZEN${suffix ? ` ${suffix}` : ""}</span>`;
  }

  return `<span style="display:inline-flex;align-items:baseline;font-size:${fontSize};font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${color};font-family:Orbitron,'Segoe UI',sans-serif;"><span style="font-size:1.125em;line-height:1;">T</span><span>RIZEN</span>${suffix ? `<span>${suffix}</span>` : ""}</span>`;
}
