type EnquiryEmailData = {
  name: string;
  email: string;
  company: string;
  website: string;
  budget: string;
  start: string;
  launch: string;
  brief: string;
  locale: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const dash = (value: string) => (value.trim() ? value.trim() : "—");

const formatDate = (value: string) => {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[3]}.${match[2]}.${match[1]}`;
};

const row = (label: string, value: string, href?: string) => {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  const content = href
    ? `<a href="${escapeHtml(href)}" style="color:#1f5eff;text-decoration:none;">${safeValue}</a>`
    : safeValue;

  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #ececec;width:34%;vertical-align:top;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8a8a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        ${safeLabel}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #ececec;vertical-align:top;font-size:15px;line-height:1.45;color:#2b2b2b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        ${content}
      </td>
    </tr>
  `;
};

export function buildEnquiryEmail(data: EnquiryEmailData) {
  const website = dash(data.website);
  const websiteHref =
    data.website.trim().length > 0
      ? data.website.startsWith("http")
        ? data.website
        : `https://${data.website}`
      : undefined;

  const text = [
    "New project enquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${dash(data.company)}`,
    `Website: ${website}`,
    `Budget: ${data.budget}`,
    `Start: ${formatDate(data.start)}`,
    `Launch: ${formatDate(data.launch)}`,
    `Locale: ${dash(data.locale)}`,
    "",
    "Brief",
    data.brief,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#e8e8e8;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e8e8e8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 20px;border-bottom:1px solid #ececec;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#1f5eff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                  uitherapy
                </p>
                <h1 style="margin:0;font-size:28px;line-height:1.15;letter-spacing:-0.03em;color:#2b2b2b;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                  New project enquiry
                </h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#6a6a6a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                  ${escapeHtml(data.name)}${data.company.trim() ? ` · ${escapeHtml(data.company.trim())}` : ""}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${row("Name", data.name)}
                  ${row("Email", data.email, `mailto:${data.email}`)}
                  ${row("Company", dash(data.company))}
                  ${row("Website", website, websiteHref)}
                  ${row("Budget", data.budget)}
                  ${row("Start", formatDate(data.start))}
                  ${row("Launch", formatDate(data.launch))}
                  ${row("Locale", dash(data.locale))}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px;">
                <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8a8a8a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                  Brief
                </p>
                <div style="padding:16px 18px;border-radius:14px;background:#f5f5f5;font-size:15px;line-height:1.6;color:#2b2b2b;white-space:pre-wrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
${escapeHtml(data.brief)}
                </div>
                <p style="margin:22px 0 0;">
                  <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#1f5eff;color:#ffffff;text-decoration:none;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                    Reply to ${escapeHtml(data.name)}
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}
