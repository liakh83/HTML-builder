const fs = require('fs').promises;
const path = require('path');

const style = path.join(__dirname, 'styles');
const pathDirProject = path.join(__dirname, 'project-dist');
const pathProject = path.join(__dirname, 'project-dist', 'style.css');
console.log(pathDirProject);

async function createDir(path) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}
createDir(pathDirProject);

async function mergeStyle() {
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
