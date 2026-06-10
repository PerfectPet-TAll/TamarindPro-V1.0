import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Copilot
  app.post("/api/copilot", async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.json({
        text: "ขณะนี้ระบบ AI Copilot ทำงานใน **โหมดแนะนำข้อมูลออฟไลน์ (Offline Mode)** เนื่องจากตรวจไม่พบ API Key ของกูเกิลเกอมีนายในระบบ\n\n**วิธีตั้งค่าใช้งานระบบออนไลน์พร้อมการค้นหาแบบสมบูรณ์:**\n1. ไปที่เมนู **Settings** (รูปฟันเฟือง ด้านบนขวา)\n2. เลือกเมนูย่อย **Secrets**\n3. เพิ่มตัวแปรชื่อ `GEMINI_API_KEY` และใส่ API Key ของคุณที่ออกโดย Google AI Studio\n4. บันทึกและรีสตาร์ทระบบ เพื่อให้ Copilot สามารถดึงข้อมูลความรู้จริงและค้นหาข้อมูลความรู้บนอินเทอร์เน็ต (Google Search Grounding) แบบสด ๆ ได้ทันทีครับ!",
        groundingChunks: [],
        isOffline: true
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const baseChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingChunks = baseChunks.map((c: any) => {
        if (c.web) {
          return {
            title: c.web.title || "แหล่งข้อมูลอ้างอิง",
            uri: c.web.uri || "#"
          };
        }
        return null;
      }).filter(Boolean);

      return res.json({
        text,
        groundingChunks,
        isOffline: false
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.json({
        text: `เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini API: ${err.message || err}\n\nระบบสลับมาใช้งานข้อมูลออฟไลน์แนะนำสำรองชั่วคราว กรุณาตรวจสอบความถูกต้องของ GEMINI_API_KEY ในหน้าจอตั้งค่าของคุณ`,
        groundingChunks: [],
        isOffline: true,
        error: err.message || String(err)
      });
    }
  });

  // API Route for Context-Aware Shipping Docs Translator using Gemini 3.5 Flash
  app.post("/api/translate-shipping-fields", async (req, res) => {
    const { fields, destination, targetLanguage } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      const fallbackTranslations: Record<string, string> = {
        "มะขามหวาน": "Sweet Tamarind",
        "มะขามกวน": "Tamarind Paste",
        "ลูกอมมะขาม": "Tamarind Candy",
        "น้ำมะขาม": "Tamarind Juice",
        "Tamarind Balls": "มะขามแก้ว",
        "Sweet Tamarind": "มะขามหวาน",
        "FT": "Fresh Tamarind",
        "TB": "Tamarind Balls"
      };

      const translated: Record<string, any> = {};
      for (const [key, value] of Object.entries(fields || {})) {
        if (typeof value === 'string') {
          translated[key] = fallbackTranslations[value] || value;
        } else if (Array.isArray(value)) {
          translated[key] = value.map((item: any) => {
            const newItem = { ...item };
            for (const [itemKey, itemVal] of Object.entries(item)) {
              if (typeof itemVal === 'string') {
                newItem[itemKey] = fallbackTranslations[itemVal] || itemVal;
              }
            }
            return newItem;
          });
        } else {
          translated[key] = value;
        }
      }
      return res.json({ success: true, data: translated, isOffline: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an expert shipping customs translation system for TamarindPro.
Translate the following shipping document fields to the target language appropriate for the export destination "${destination || 'International customs'}".
Target Language requested: ${targetLanguage || 'English (default for international customs)'}.

Here is the JSON object of fields to translate:
${JSON.stringify(fields, null, 2)}

Provide the response in the EXACT same JSON structure, where the values are replaced by the translations.
For shipping with destination "${destination}", adapt fields (e.g. products, descriptions, weights, billing terms) to match standard international cargo customs syntax for that country.
Return ONLY valid JSON. Absolutely no markdown backticks, no text before or after.`;

      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let response;
      let lastError;

      for (const model of modelsToTry) {
        let retries = 2;
        while (retries > 0) {
          try {
            console.log(`Attempting translation with model: ${model}`);
            response = await ai.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              },
            });
            break; // success
          } catch (err: any) {
            lastError = err;
            console.warn(`Error with model ${model}:`, err.message);
            // Retry on 503 or 429 or UNAVAILABLE
            if (err.status === 503 || err.status === 429 || err?.message?.includes("503") || err?.message?.includes("429") || err?.message?.includes("UNAVAILABLE")) {
               retries--;
               if (retries > 0) {
                   await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s then retry
               }
            } else {
               break; // Not a retryable error, try next model
            }
          }
        }
        if (response) {
          break; // stop trying models if we succeeded
        }
      }

      if (!response) {
          throw lastError || new Error("Failed to contact Gemini after trying multiple models.");
      }

      const text = response.text || "{}";
      const cleaned = text.trim().replace(/^```json/, "").replace(/```$/, "").trim();
      const translated = JSON.parse(cleaned);
      return res.json({ success: true, data: translated, isOffline: false });
    } catch (err: any) {
      console.error("Translation API Error:", err);
      return res.json({ success: true, data: fields, isOffline: true, error: err.message });
    }
  });

  // API Route for Shipping Status Lookup
  app.post("/api/shipping-status", async (req, res) => {
    const { trackingNumber } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return res.json({
        success: false,
        message: "API Key is missing for Google Search. Please configure GEMINI_API_KEY in settings.",
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const prompt = `Please look up the current real-time shipping status for the container or tracking number: ${trackingNumber}.
Use the googleSearch tool to find tracking information from public carrier websites. 
Provide a concise summary in Thai including:
- Current Status (State)
- Location
- Estimated Arrival Date (if available)
- Carrier (if known)
Return ONLY the summary.`;

      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let response;
      let lastError;

      for (const model of modelsToTry) {
        let retries = 2;
        while (retries > 0) {
          try {
            console.log(`Attempting shipping status check with model: ${model}`);
            response = await ai.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                tools: [{ googleSearch: {} }],
              },
            });
            break; // success
          } catch (err: any) {
            lastError = err;
            console.warn(`Error with model ${model} for shipping status:`, err.message);
            // Retry on 503 or 429
            if (err.status === 503 || err.status === 429 || err?.message?.includes("503") || err?.message?.includes("429") || err?.message?.includes("UNAVAILABLE")) {
               retries--;
               if (retries > 0) {
                   await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s then retry
               }
            } else {
               break; // Not a retryable error, try next model
            }
          }
        }
        if (response) {
          break; // stop trying models if we succeeded
        }
      }

      if (!response) {
         throw lastError || new Error("Failed to contact Gemini after trying multiple models.");
      }

      const text = response.text || "ไม่พบข้อมูลการจัดส่ง 🚨";
      return res.json({ success: true, data: text });
    } catch (err: any) {
      console.error("Shipping API Error:", err);
      return res.json({ success: false, message: "เกิดข้อผิดพลาด: " + err.message });
    }
  });

  // Serve static assets in production, otherwise Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
