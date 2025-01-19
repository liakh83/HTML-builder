const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');
// console.log(pathFolder);
fs.readdir(pathFolder, { withFileTypes: true }, (_, files) => {
  // console.log(files);
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(pathFolder, file.name);
      fs.stat(filePath, (_, stats) => {
        const nameFile = file.name.split('.')[0];
        const extensionFile = file.name.split('.')[1];
        const fileSize = (stats.size / 1024).toFixed(3);
        // console.log(filePath);
        console.log(`${nameFile} - ${extensionFile} - ${fileSize}kb`);
      });
    }
  });
});
