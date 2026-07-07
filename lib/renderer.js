const { createCanvas } = require('@napi-rs/canvas');

async function renderBratText(text) {
  const width = 512;
  const height = 512;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // BACKGROUND PUTIH (biar keliatan jelas)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  
  const maxWidth = width - 60;
  const maxHeight = height - 60;
  
  // Warna text HITAM biar kontras
  const textColor = '#000000';
  const outlineColor = '#FFFFFF'; // Outline putih biar keliatan
  const outlineWidth = 4;
  
  let fontSize = 40;
  let lines = wrapText(ctx, text, maxWidth, fontSize);
  let textMetrics = measureTextLines(ctx, lines, fontSize);
  
  while (
    (textMetrics.width > maxWidth || textMetrics.height > maxHeight) && 
    fontSize > 10
  ) {
    fontSize -= 2;
    lines = wrapText(ctx, text, maxWidth, fontSize);
    textMetrics = measureTextLines(ctx, lines, fontSize);
  }
  
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${fontSize}px "Arial", "Helvetica", "Liberation Sans", "Noto Sans", sans-serif`;
  
  const startX = width / 2;
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (height - totalHeight) / 2 + fontSize / 2;
  
  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    
    // Outline putih biar keliatan
    ctx.shadowColor = outlineColor;
    ctx.shadowBlur = 0;
    ctx.lineWidth = outlineWidth * 2;
    ctx.strokeStyle = outlineColor;
    ctx.strokeText(line, startX, y);
    
    // Text hitam
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = textColor;
    ctx.fillText(line, startX, y);
  });
  
  return canvas.toBuffer('image/png');
}

function wrapText(ctx, text, maxWidth, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  ctx.font = `bold ${fontSize}px "Arial", "Helvetica", "Liberation Sans", "Noto Sans", sans-serif`;
  
  for (let word of words) {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }
  
  if (lines.length === 0) {
    lines.push(' ');
  }
  
  return lines;
}

function measureTextLines(ctx, lines, fontSize) {
  ctx.font = `bold ${fontSize}px "Arial", "Helvetica", "Liberation Sans", "Noto Sans", sans-serif`;
  
  let maxLineWidth = 0;
  const lineHeight = fontSize * 1.2;
  
  lines.forEach(line => {
    const metrics = ctx.measureText(line);
    maxLineWidth = Math.max(maxLineWidth, metrics.width);
  });
  
  return {
    width: maxLineWidth,
    height: lines.length * lineHeight
  };
}

module.exports = {
  renderBratText
};
