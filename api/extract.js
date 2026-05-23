import https from "https";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { imageData, mediaType } = req.body;

    const payload = JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mediaType, data: imageData } },
          { text: 'Extract transaction data from this Nigerian payment receipt. Return ONLY valid JSON: {"amount":"number only","sender_name":"string","bank_name":"string","transaction_date":"YYYY-MM-DD","narration":"string","confidence":"high/medium/low"}' }
        ]
      }]
    });

    const result = await new Promise((resolve, reject) => {
      const request = https.request({
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      }, (response) => {
        let data = "";
        response.on("data", chunk => data += chunk);
        response.on("end", () => resolve(JSON.parse(data)));
      });
      request.on("error", reject);
      request.write(payload);
      request.end();
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}