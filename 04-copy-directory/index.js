const fs = require('fs').promises;
const path = require('path');

async function copyFolder() {
  const folderData = path.join(__dirname, 'files');
  const copyFolderData = path.join(__dirname, 'files-copy');
  try {
    try {
      await fs.rm(copyFolderData, { recursive: true }, { force: true });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
    await fs.mkdir(copyFolderData, { recursive: true });
    await copyContent(folderData, copyFolderData);
  } catch (error) {
    console.error(error);
  }
}

async function copyContent(data, copyData) {
  try {
    const contents = await fs.readdir(data, { withFileTypes: true });

    for (const content of contents) {
      const dataPath = path.join(data, content.name);
      const copyDataPath = path.join(copyData, content.name);
      if (content.isDirectory()) {
        await fs.mkdir(copyDataPath, { recursive: true });
        await copyContent(dataPath, copyDataPath);
      } else if (content.isFile()) {
        await fs.copyFile(dataPath, copyDataPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyFolder();
