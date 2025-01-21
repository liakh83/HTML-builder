const fs = require('fs').promises;
const path = require('path');

const styles = path.join(__dirname, 'styles');
const pathDirProject = path.join(__dirname, 'project-dist');
const pathProject = path.join(__dirname, 'project-dist', 'style.css');

const assetsOriginal = path.join(__dirname, 'assets');
const assetsCopy = path.join(__dirname, 'project-dist', 'assets');

const indexHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

async function createDir(path) {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

async function createHtmlFile() {
  try {
    let readTemplate = await fs.readFile(templatePath, 'utf-8');
    const componentsDir = await fs.readdir(componentsPath, {
      withFileTypes: true,
    });
    for (const file of componentsDir) {
      const filePath = path.join(componentsPath, file.name);
      const { name, ext } = path.parse(filePath);
      // console.log(name, ext);
      if (file.isFile() && ext === '.html') {
        const content = await fs.readFile(filePath, 'utf-8');
        const regex = new RegExp(`{{${name}}}`, 'g');
        readTemplate = readTemplate.replace(regex, content);
      }
    }
    await fs.writeFile(indexHtmlPath, readTemplate, 'utf-8');
  } catch (err) {
    console.error(err);
  }
}

async function mergeStyle() {
  try {
    const files = await fs.readdir(styles);
    // console.log(files);
    let allFile = [];
    for (const file of files) {
      const pathFile = path.join(styles, file);
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

async function copyContent(assetsOriginal, assetsCopy) {
  try {
    const contents = await fs.readdir(assetsOriginal, { withFileTypes: true });

    for (const content of contents) {
      const dataPath = path.join(assetsOriginal, content.name);
      const copyDataPath = path.join(assetsCopy, content.name);
      if (content.isDirectory()) {
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

async function htmlBuilder() {
  try {
    await createDir(pathDirProject);
    await createHtmlFile();
    await mergeStyle();
    await copyContent(assetsOriginal, assetsCopy);
  } catch (err) {
    console.error(err);
  }
}

htmlBuilder();
