// Usage: node make-gif.js <output.gif> <delay_ms> <frame1.png> [frame2.png ...]
const GIFEncoder = require('gif-encoder-2');
const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

async function makeGif(outputPath, delayMs, frames) {
  const first = await Jimp.read(frames[0]);
  const { width, height } = first.bitmap;

  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  const stream = encoder.createReadStream();
  const chunks = [];
  stream.on('data', chunk => chunks.push(chunk));

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(delayMs);
  encoder.setQuality(10);

  for (const framePath of frames) {
    const img = await Jimp.read(framePath);
    img.resize({ w: width, h: height });
    encoder.addFrame(img.bitmap.data);
    process.stdout.write('.');
  }

  encoder.finish();
  await new Promise(r => stream.on('end', r));

  fs.writeFileSync(outputPath, Buffer.concat(chunks));
  console.log(`\nSaved: ${outputPath} (${frames.length} frames, ${width}x${height})`);
}

const [,, output, delay, ...frames] = process.argv;
if (!output || !frames.length) {
  console.error('Usage: node make-gif.js output.gif delay_ms frame1.png ...');
  process.exit(1);
}
makeGif(output, parseInt(delay) || 800, frames).catch(e => { console.error(e); process.exit(1); });
