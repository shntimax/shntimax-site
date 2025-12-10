// optimize-wini.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'assets-raw/thailand';
const outputDir = 'assets/thailand';  // ← klein "wini" wie dein Ordner!

// Erstelle Ausgabeordner falls nicht vorhanden
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// NATURAL SORT – das ist der Trick!
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

const files = fs.readdirSync(inputDir)
  .filter(file => /\.(jpe?g|png)$/i.test(file))  // nur Bilder
  .sort(naturalSort);  // optional: alphabetisch sortieren

files.forEach((file, index) => {
  const inputPath = path.join(inputDir, file);
  const newFileName = `Thphoto${index + 1}.webp`;           // ← Wphoto1, Wphoto2, ...
  const outputPath = path.join(outputDir, newFileName);

  sharp(inputPath)
    .rotate()                     // korrigiert EXIF-Drehung automatisch
    .resize(1400, null, {         // max 1400px Breite, Höhe proportional
      withoutEnlargement: true
    })
    .webp({ 
      quality: 80,
      effort: 6                    // schneller = 4, besser = 6 (empfohlen)
    })
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(`Fehler bei ${file}:`, err);
      } else {
        console.log(`${file} → ${newFileName} (${info.width}×${info.height})`);
      }
    });
});

console.log(`Starte Optimierung von ${files.length} Bildern → ${outputDir}`);
