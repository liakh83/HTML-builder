const fs = require('fs');
const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const filePath = __dirname + '/text.txt';
console.log(filePath);
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
console.log(
  'Welcome, please write your text. If you want to exit, write "exit" or press "Ctrl + C".',
);

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    exit();
  } else {
    writeStream.write(input + '\n', () => {
      console.log(
        'Write text again.If you want to exit, write "exit" or press "Ctrl + C',
      );
    });
  }
  rl.on('SIGINT', () => {
    exit();
  });
});

function exit() {
  console.log('Your text was written successfully. Goodbye');
  writeStream.end();
  rl.close();
  process.exit();
}
