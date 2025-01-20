const fs = require('fs').promises;
const path = require('path');

const style = path.join(__dirname, 'styles');
const pathDirProject = path.join(__dirname, 'project-dist');
const pathProject = path.join(__dirname, 'project-dist', 'style.css');
console.log(pathDirProject);

const assetsOriginal = path.join(__dirname, 'assets');
const assetsCopy = path.join(__dirname, 'project-dist', 'assets');

async function createDir(path) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyle() {
  createDir(pathDirProject);
  try {
    const files = await fs.readdir(style);
    // console.log(files);
    let allFile = [];
    for (const file of files) {
      const pathFile = path.join(style, file);
      const extname = path.extname(file);
      const stat = await fs.stat(pathFile);
      // console.log(extname, '\n', pathFile, '\n', allFile);
      if (extname === '.css' && stat.isFile()) {
        const fileContent = await fs.readFile(pathFile, 'utf-8');
        // console.log(fileContent);
        allFile.push(fileContent);
      }
    }
    await fs.writeFile(pathProject, allFile);
  } catch (error) {
    console.error(error);
  }
}
mergeStyle();

// async function copyFolder() {
//   const folderData = path.join(__dirname, 'assets');
//   const copyFolderData = path.join(__dirname, 'project-dist', 'assets');
//   try {
//     try {
//       await fs.rm(copyFolderData, { recursive: true }, { force: true });
//     } catch (err) {
//       if (err.code !== 'ENOENT') {
//         throw err;
//       }
//     }
//     createDir(copyFolderData);
//     // await fs.mkdir(copyFolderData, { recursive: true });
//     await copyContent(folderData, copyFolderData);
//   } catch (error) {
//     console.error(error);
//   }
// }

async function copyContent(assetsOriginal, assetsCopy) {
  try {
    const contents = await fs.readdir(assetsOriginal, { withFileTypes: true });

    for (const content of contents) {
      const dataPath = path.join(assetsOriginal, content.name);
      const copyDataPath = path.join(assetsCopy, content.name);
      if (content.isDirectory()) {
        // await fs.mkdir(dataPath, { withFileTypes: true });
        await createDir(copyDataPath);
        await copyContent(dataPath, copyDataPath);
      } else if (content.isFile()) {
        await createDir(path.dirname(copyDataPath));
        await fs.copyFile(dataPath, copyDataPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// copyFolder();
copyContent(assetsOriginal, assetsCopy);
