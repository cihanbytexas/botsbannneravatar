import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { token, image_url } = req.body;
  if (!token || !image_url)
    return res.status(400).json({ error: "token and image_url required" });

  try {
    // Görseli indir
    const img = await fetch(image_url);
    const buffer = await img.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const image = `data:image/png;base64,${base64}`;

    // Discord API'ye isteği gönder
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      method: "PATCH",
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ avatar: image })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.json({ success: true, message: "Bot avatar changed successfully!", data });
  } catch (err) {
    res.status(500).json({ error: "Failed to change avatar", details: err.message });
  }
}
