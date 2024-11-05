import fs from "fs"
import path from 'path'

const rootDir = './'; // Replace with your root directory if it's different

// Function to rename .js files to .tsx recursively
function renameJsToTsx(dir) {
  // Read the contents of the current directory
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}:`, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // If it's a directory, recurse into it
        renameJsToTsx(fullPath);
      } else if (stat.isFile() && file.endsWith('.js')) {
        // If it's a .js file, rename it to .tsx
        const newFileName = file.replace(/\.js$/, '.tsx');
        const newFullPath = path.join(dir, newFileName);

        fs.rename(fullPath, newFullPath, (err) => {
          if (err) {
            console.error(`Error renaming file ${fullPath} to ${newFullPath}:`, err);
          } else {
            console.log(`Renamed: ${fullPath} -> ${newFullPath}`);
          }
        });
      }
    });
  });
}

// Start the process from the root directory
renameJsToTsx(rootDir);
