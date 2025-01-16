const fileSystem = require('fs');

const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

const readeStream = fileSystem.createReadStream(filePath, 'utf-8');
readeStream.pipe(process.stdout);
