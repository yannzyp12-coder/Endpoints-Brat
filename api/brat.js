const { renderBratText } = require('../lib/renderer');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.query;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        error: 'Parameter "text" wajib diisi',
        example: '/api/brat?text=Halo%20Dunia'
      });
    }
    
    const decodedText = decodeURIComponent(text);
    const imageBuffer = await renderBratText(decodedText);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(imageBuffer);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Gagal generate sticker',
      message: error.message,
      hint: 'Pastikan text tidak mengandung karakter aneh'
    });
  }
};
