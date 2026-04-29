import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body;

  try {
    // 1. SAVE TO SUPABASE
    const response = await fetch(
      "https://cnpdtxmabmkmraauiseh.supabase.co/rest/v1/leads",
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    // 2. SEND EMAIL TO YOU (ADMIN)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "ryzenoutsourcing@gmail.com",
      subject: `🚗 New Lead from ${name}`,
      reply_to: email,
      html: `
        <h2>New Lead</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    // 3. SEND CONFIRMATION TO CLIENT
 await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "Auto M50 – Demande bien reçue / Aanvraag ontvangen",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">

      <h2>🚗 AUTO M50</h2>
<p style="color:#DF0000;font-weight:bold;">Carrosserie Auto M50 – Premium Service in Brussel</p>
      <p><strong>FR 🇫🇷</strong></p>
      <p>Bonjour ${name},</p>
      <p>Nous avons bien reçu votre demande.</p>
      <p>Notre équipe va traiter votre dossier et vous contacter dans les plus brefs délais.</p>
      <p>Merci pour votre confiance.</p>

      <hr style="margin:20px 0;">

      <p><strong>NL 🇳🇱</strong></p>
      <p>Hallo ${name},</p>
      <p>Wij hebben uw aanvraag goed ontvangen.</p>
      <p>Ons team zal uw verzoek behandelen en u zo snel mogelijk contacteren.</p>
      <p>Bedankt voor uw vertrouwen.</p>

      <hr style="margin:20px 0;">

      <p><strong>Auto M50</strong><br>
      Carrosserie & Takeldienst Brussel<br>
      📞 02 324 77 42</p>

    </div>
  `
});

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
