// server.js
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Resolve __dirname in ES module style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3', prompt }),
    });

    let data = '';
    for await (const chunk of ollamaRes.body) {
      data += chunk;
    }

    const responseText = data
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line).response)
      .join('');

    res.json({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
