const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { imageData, mediaType } = JSON.parse(event.body);

    const payload = JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mediaType,
              data: imageData
            }
          },
          {
            text: 'Extract transaction data from this Nigerian payment receipt. Return ONLY valid JSON with no extra text: {"amount":"number only e.g. 25000","sender_name":"name of sender","bank_name":"bank or payment platform name","transaction_date":"YYYY-MM-DD","narration":"what the payment is for","confidence":"high/medium/low"}'
          }
        ]
      }]
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};