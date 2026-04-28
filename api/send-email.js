await fetch("https://cnpdtxmabmkmraauiseh.supabase.co/rest/v1/", {
  method: "POST",
  headers: {
    "apikey": process.env.SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    naam: name,
    mobiel: phone,
    email: email,
    bericht: message
  })
});
