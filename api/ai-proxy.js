export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed', status: 405 });
    return;
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const provider = data.provider || 'gemini';
    const apiKey = (data.apiKey || '').trim();
    const model = (data.model || '').trim();
    const system = data.system || '';
    const prompt = data.prompt || '';

    if (!apiKey) {
      res.status(400).json({ error: 'Missing API key', status: 400 });
      return;
    }

    let responseText = '';
    if (provider === 'gemini') {
      const targetModel = model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const fullText = system ? `${system}\n\n${prompt}` : prompt;
      const apiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullText }] }],
          generationConfig: { maxOutputTokens: 1200 }
        })
      });
      const resJson = await apiRes.json();
      if (!apiRes.ok) {
        let errMsg = resJson.error?.message || `Gemini API error (${apiRes.status})`;
        if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid') || apiRes.status === 400) {
          errMsg = "Gemini API key is invalid. Free keys from Google AI Studio (aistudio.google.com) start with 'AIzaSy...'. Please check your key.";
        }
        throw new Error(errMsg);
      }
      const parts = resJson.candidates?.[0]?.content?.parts || [];
      const textParts = parts.filter(p => !p.thought && p.text).map(p => p.text);
      responseText = textParts.join('') || (parts[parts.length - 1]?.text || '');
    } else if (provider === 'openai') {
      const targetModel = model || 'gpt-4o-mini';
      const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 600,
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt }
          ]
        })
      });
      const resJson = await apiRes.json();
      if (!apiRes.ok) throw new Error(resJson.error?.message || `OpenAI error (${apiRes.status})`);
      responseText = resJson.choices?.[0]?.message?.content || '';
    } else if (provider === 'anthropic') {
      const targetModel = model || 'claude-3-5-haiku-20241022';
      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 600,
          system,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const resJson = await apiRes.json();
      if (!apiRes.ok) throw new Error(resJson.error?.message || `Anthropic error (${apiRes.status})`);
      responseText = resJson.content?.[0]?.text || '';
    } else if (provider === 'openrouter') {
      const targetModel = model || 'google/gemini-2.0-flash-001';
      const apiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': req.headers.referer || 'https://hypurrtrade.vercel.app',
          'X-Title': 'HypurrTrade'
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 600,
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt }
          ]
        })
      });
      const resJson = await apiRes.json();
      if (!apiRes.ok) throw new Error(resJson.error?.message || `OpenRouter error (${apiRes.status})`);
      responseText = resJson.choices?.[0]?.message?.content || '';
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    res.status(200).json({ text: responseText });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err), status: 500 });
  }
}
