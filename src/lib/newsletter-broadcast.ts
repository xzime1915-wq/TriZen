import { sendEmail } from "@/lib/email";
import { listActiveNewsletterSubscribers } from "@/lib/newsletter-subscribers";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { trizenBrandHtml } from "@/lib/trizen-brand";

type BlogPostForBroadcast = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
};

function blogPostUrl(slug: string) {
  return `${SITE_URL}/blog/${slug}`;
}

function sandboxEmailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:48px 20px;background:#ffffff;font-family:Orbitron,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto">
      <tr>
        <td align="center" style="padding-bottom:28px">
          ${trizenBrandHtml({ fontSize: "24px", email: true })}
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e4e4e7;padding-top:32px">
          <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#71717a;text-align:center">
            Sandbox
          </p>
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#18181b;text-align:center">${title}</h1>
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding-top:32px">
          <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;text-align:center">
            ${SITE_NAME} · support@trizenstore.com.bd
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildBlogBroadcastEmail(
  post: BlogPostForBroadcast,
  firstName?: string,
) {
  const url = blogPostUrl(post.slug);
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi there,";
  const summary =
    post.excerpt.trim() ||
    "Fresh esports gear news and updates from TRIZEN Store.";

  const text = [
    greeting,
    "",
    `New on the TRIZEN blog: ${post.title}`,
    "",
    summary,
    "",
    `Read now: ${url}`,
    "",
    SITE_NAME,
    "support@trizenstore.com.bd",
  ].join("\n");

  const html = sandboxEmailShell(
    "New blog post",
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#52525b;text-align:center">${greeting}</p>
     <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;text-align:center">${post.category}</p>
     <p style="margin:0 0 16px;font-size:18px;line-height:1.45;color:#18181b;text-align:center;font-weight:700">${post.title}</p>
     <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#52525b;text-align:center">${summary}</p>
     <p style="margin:0;text-align:center">
       <a href="${url}" style="display:inline-block;border:1px solid #18181b;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 22px;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase">
         Read article
       </a>
     </p>`,
  );

  return {
    subject: `New from Sandbox: ${post.title}`,
    text,
    html,
  };
}

export async function broadcastBlogPostToSandbox(
  post: BlogPostForBroadcast,
): Promise<{ sent: number; failed: number }> {
  const subscribers = await listActiveNewsletterSubscribers();
  if (subscribers.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    const message = buildBlogBroadcastEmail(post, subscriber.firstName);
    try {
      await sendEmail({
        to: subscriber.email,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error("[sandbox broadcast]", subscriber.email, error);
    }
  }

  return { sent, failed };
}
