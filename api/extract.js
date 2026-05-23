const https = require("https");

exports.handler = async (event) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const { imageData, mediaType } = body;

  const payload = JSON.stringify({
    contents: [{
      parts: [
        { inline_data: { mime_type: mediaType, data: imageData } },
        { text: 'Extract transaction data from this Nigerian payment receipt. Return ONLY valid JSON: {"amount":"number only","sender_name":"string","bank_name":"string","transaction_date":"YYYY-MM-DD","narration":"string","confidence":"high/medium/low"}' }
      ]
    }]
  });

  const result = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  return new Response(JSON.stringify(parsed), {
    headers: { "Content-Type": "application/json" }
  });
};