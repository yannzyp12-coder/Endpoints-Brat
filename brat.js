const express = require('express');
const { renderBratText } = require('../lib/renderer');

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/api/brat', async (req, res) => {
  try {
    const { text } = req.query;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        error: 'Parameter "text" wajib diisi dan tidak boleh kosong',
        example: '/api/brat?text=Halo%20Dunia'
      });
    }
    
    const decodedText = decodeURIComponent(text);
    const imageBuffer = await renderBratText(decodedText);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Length', imageBuffer.length);
    res.send(imageBuffer);
    
  } catch (error) {
    console.error('Error rendering BRAT:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses request',
      message: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint tidak ditemukan',
    available: ['GET /api/brat?text={text}', 'GET /api/health']
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = app;