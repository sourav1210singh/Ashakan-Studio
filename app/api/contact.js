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

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;max-width:600px">
      <h2 style="margin:0 0 16px">New enquiry from the website</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 0;width:130px;color:#888">Name</td><td style="padding:6px 0"><strong>${esc(name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0">${esc(email)}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Company</td><td style="padding:6px 0">${esc(company) || "-"}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Project type</td><td style="padding:6px 0">${esc(projectType) || "-"}</td></tr>
      </table>
      <p style="margin:16px 0 6px;color:#888">Message</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.5">${esc(message)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#aaa;font-size:12px;margin:0">Sent from the ashkanstudios.com contact form</p>
    </div>`;

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
