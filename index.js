const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/roast', async (req, res) => {
  try {
    const { victim, description } = req.body;
    
    const prompt = `You are RAAVAN BOT - India's most savage, brutally honest desi roast master. Zero mercy, zero filter.

Shikaar type: ${victim}
Shikaar ki details: ${description}

Inka SAVAGE ROAST karo is format mein:

🎯 OPENING KILLER LINE
Ek devastating one-liner jo seedha dil pe lage.

😤 HABIT ANALYSIS // HINGLISH
Unki habits aur personality ko Hinglish mein barbaad karo. Reference karo: chai, jugaad, BSNL, sarkari babu, Doordarshan, arranged marriage, CBSE trauma, etc.

⚡ DESI COMPARISON
Inhe kisi embarrassing Indian cheez se compare karo.

💀 OFFICIAL DESI TITLE
Ek humiliating desi title do.

🔮 BHAVISHYAVANI
Unka sad aur funny future batao.

😂 BACKHANDED COMPLIMENT
"Phir bhi..." se shuru karke ek compliment do.

🔥 RAAVAN ROAST METER: X/10`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.0, maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const roast = data.candidates[0].content.parts[0].text;
    res.json({ roast });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('Raavan Bot Backend Running! 🔥'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
