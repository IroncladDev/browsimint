import fs from "fs";
import path from "path";

const cjsHelpersPath = "./dist/_commonjsHelpers.js";

if (fs.existsSync(cjsHelpersPath)) {
  fs.renameSync(cjsHelpersPath, "./dist/commonjsHelpers.js");
}

// replace _commonjsHelpers.js with commonjsHelpers.js in every javascript file in dist

function getAllJsFiles(dir: string, fileList: Array<string> = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (stat.isFile() && file.endsWith(".js")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

for (const path of getAllJsFiles("./dist")) {
  const fileContents = fs.readFileSync(path, "utf8");
  const newFileContents = fileContents.replace(
    /_commonjsHelpers\.js/g,
    "commonjsHelpers.js"
  );
  fs.writeFileSync(path, newFileContents, "utf8");
}
