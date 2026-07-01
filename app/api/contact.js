// Vercel serverless function — Ashkan Studios contact form -> Resend email.
// The Resend API key is read from the RESEND_API_KEY environment variable
// (set in Vercel: Project Settings -> Environment Variables). The key is a
// secret and is NEVER committed to the repo.
//
// Sends every submission to info@ashkanstudios.com, BCC leadquality@incrementors.com,
// with Reply-To set to the visitor's email so replies go straight to the lead.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company, projectType, message } = req.body || {};

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please fill in your name, email, and message." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const esc = (v) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  // Brand-matched HTML email (mirrors the site: dark #1A1A1A header,
  // cream #F5F5F0 canvas, warmbeige #E8E0D1 accent, Anton-style condensed
  // uppercase wordmark faked with bold + wide letter-spacing since email
  // clients can't load web fonts). Table-based layout for Outlook/Gmail.
  const row = (label, value) => `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;width:130px;vertical-align:top">${label}</td>
          <td style="padding:14px 0;border-bottom:1px solid #E7E2D6;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#1A1A1A;vertical-align:top">${value}</td>
        </tr>`;

  const html = `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">New enquiry from ${esc(name)}${company ? " at " + esc(company) : ""} via the website contact form.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#1A1A1A;margin:0;padding:0">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:600px;background-color:#F5F5F0">

        <!-- Header -->
        <tr><td align="center" style="background-color:#1A1A1A;padding:40px 40px 34px">
          <div style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:30px;letter-spacing:9px;color:#F5F5F0;line-height:1">ASHKAN</div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:6px;color:#E8E0D1;margin-top:6px">— STUDIOS —</div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8f8a7f;margin-top:22px">New Website Enquiry</div>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding:38px 40px 8px">
          <div style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:26px;letter-spacing:1px;text-transform:uppercase;color:#1A1A1A;line-height:1.15">You've got a new lead</div>
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#6f6a60;margin-top:8px">Someone reached out through the contact form. Details below.</div>
        </td></tr>

        <!-- Details -->
        <tr><td style="padding:14px 40px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${row("Name", `<strong style="font-weight:bold">${esc(name)}</strong>`)}
            ${row("Email", `<a href="mailto:${esc(email)}" style="color:#1A1A1A;text-decoration:underline">${esc(email)}</a>`)}
            ${row("Company", esc(company) || "&mdash;")}
            ${row("Project type", esc(projectType) || "&mdash;")}
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:28px 40px 0">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a958a;margin-bottom:10px">Message</div>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#E8E0D1">
            <tr><td style="padding:20px 22px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1A1A1A;white-space:pre-wrap">${esc(message)}</td></tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:30px 40px 40px">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr><td style="background-color:#1A1A1A">
              <a href="mailto:${esc(email)}?subject=Re:%20Your%20enquiry%20with%20Ashkan%20Studios" style="display:inline-block;padding:15px 34px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#F5F5F0;text-decoration:none">Reply to ${esc(name)} &nbsp;&rsaquo;</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#1A1A1A;padding:26px 40px">
          <div style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8f8a7f;line-height:1.7">
            Sent from the <a href="https://ashkanstudios.com" style="color:#E8E0D1;text-decoration:none">ashkanstudios.com</a> contact form<br>
            1502 Sawyer St #108, Houston, TX 77007 &nbsp;&middot;&nbsp; (346) 335-7973
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ashkan Studios <contact@ashkanstudios.com>",
        to: ["info@ashkanstudios.com"],
        bcc: ["leadquality@incrementors.com"],
        reply_to: email,
        subject: `New enquiry from ${name}${company ? " — " + company : ""}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error("Resend error:", resp.status, detail);
      return res.status(502).json({
        error:
          "Could not send your message right now. Please try again, or email us at info@ashkanstudios.com.",
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
