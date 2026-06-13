export function trizenBrandHtml({
  fontSize = "28px",
  color = "#18181b",
  suffix = "",
}: {
  fontSize?: string;
  color?: string;
  suffix?: string;
} = {}) {
  return `<span style="display:inline-flex;align-items:baseline;font-size:${fontSize};font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${color};font-family:Orbitron,'Segoe UI',sans-serif;"><span style="font-size:1.125em;line-height:1;">T</span><span>RIZEN</span>${suffix ? `<span>${suffix}</span>` : ""}</span>`;
}
