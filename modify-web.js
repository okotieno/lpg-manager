const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', '@capacitor', 'barcode-scanner', 'dist', 'esm', 'web.js');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const modifiedData = data.replace(
    "if (error.indexOf('NotFoundException') === -1) {",
    "if (error.indexOf('NotFoundException') === -1 && error.indexOf('No barcode or QR code detected') === -1) {"
  );

  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File modified successfully!');
    }
  });
});
