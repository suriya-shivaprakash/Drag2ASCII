#!/usr/bin/env node

import { createCanvas } from 'canvas';
import { Jimp, intToRGBA } from 'jimp';
import { Command } from 'commander';
import fs from 'fs';

const ASCII_CHARS = "@%#*+=-:. ";

const program = new Command();
program
  .argument('<input>', 'input image file')
  .option('-c, --color', 'enable colored ASCII')
  .option('-w, --width <number>', 'ASCII width in characters (150-500)', '500')
  .parse(process.argv);

const options = program.opts();
const inputFile = program.args[0];

function pixelToChar(r, g, b) {
  const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const idx = Math.floor((gray / 255) * (ASCII_CHARS.length - 1));
  return ASCII_CHARS[idx];
}

import readline from 'readline';

async function promptForImage() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\nPlease drag and drop your image file into the terminal, or paste its full path:');
    rl.question('Image path: ', (answer) => {
      rl.close();
      resolve(answer.trim().replace(/["']/g, ''));
    });
  });
}

async function main() {
  try {
    let imageFilePath = inputFile;
    
    // If file doesn't exist, prompt for image
    if (!fs.existsSync(inputFile)) {
      imageFilePath = await promptForImage();
      if (!fs.existsSync(imageFilePath)) {
        console.error(`Error: Image file not found at '${imageFilePath}'`);
        process.exit(1);
      }
    }

    const img = await Jimp.read(imageFilePath);
    const cols = parseInt(options.width, 10);
    
    // Validate width parameter - only allow 150 to 500
    if (isNaN(cols) || cols <= 0) {
      console.error('Error: Width must be a positive number');
      process.exit(1);
    }
    if (cols < 150 || cols > 500) {
      console.error('Error: Width must be between 150 and 500 characters');
      process.exit(1);
    }
    
    const aspectRatio = 0.5; // adjust for character aspect ratio
    const newHeight = Math.floor((img.bitmap.height * cols / img.bitmap.width) * aspectRatio);
    img.resize({ w: cols, h: newHeight });

    // Generate ASCII data
    let asciiText = '';
    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < cols; x++) {
        const pixel = intToRGBA(img.getPixelColor(x, y));
        asciiText += pixelToChar(pixel.r, pixel.g, pixel.b);
      }
      asciiText += '\n';
    }

    // Draw ASCII to image
    const charWidth = 10;
    const charHeight = 18;
    const canvas = createCanvas(cols * charWidth, newHeight * charHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${charHeight}px monospace`;
    ctx.textBaseline = 'top';

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < cols; x++) {
        const pixel = intToRGBA(img.getPixelColor(x, y));
        const ch = pixelToChar(pixel.r, pixel.g, pixel.b);
        ctx.fillStyle = options.color ? `rgb(${pixel.r},${pixel.g},${pixel.b})` : 'black';
        ctx.fillText(ch, x * charWidth, y * charHeight);
      }
    }

    const out = fs.createWriteStream('ascii.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    out.on('finish', () => console.log('Saved ASCII art to ascii.png'));
    out.on('error', (error) => {
      console.error(`Error writing output file: ${error.message}`);
      process.exit(1);
    });
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
