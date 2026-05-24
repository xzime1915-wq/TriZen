export async function GET() {
  return new Response("google-site-verification: google906c3bf7aa051454.html", {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
