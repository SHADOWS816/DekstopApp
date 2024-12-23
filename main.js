const {app,BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');
const db = require("./database");   // importing database file 

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        // frame : false,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation : false,
            enableRemoteModule : false
        }
    });
    mainWindow.loadFile('index.html');
});

function getDirectoryFiles(directory){
    let imagesPaths = [];
    let dirPaths = [];

    const files = fs.readdirSync(directory, {withFileTypes:true});

    files.forEach( file => {
        if (file.isFile() && /\.(jpg|jpeg\png\gif)$/i.test(file.name)) {
            const fullPath = path.join(directory, file.name);
            imagesPaths.push(fullPath);
        } else if (file.isDirectory()){
            const fullPath = path.join(directory, file.name);
            dirPaths.push(fullPath);
        }
    });

    return { imagepath : imagesPaths , dirpath : dirPaths};
}


function getImagesFromDirectory(directory) {
    let imagePaths = [];
    const files = fs.readdirSync(directory, { withFileTypes: true });

    files.forEach(file => {
        
        if (file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name)) { // Check if it's a file
            // const fullPath = path.join(directory, file.name);
            // console.log(`File Path: ${fullPath}`);
            if (imagePaths.includes(directory)){

            } else {
                console.log(`adding ${directory}`);
                imagePaths.push(directory);
            }
        } else if ( file.isDirectory()){
            const fullPath = path.join(directory, file.name);
            // console.log(`File Path: ${fullPath}`);
            imagePaths = imagePaths.concat(getImagesFromDirectory(fullPath));
        }
    });
    return imagePaths;
}

ipcMain.on('load-images', (event, folderPath) => {
    if (!fs.existsSync(folderPath)) {
        event.reply('load-images-reply', { error: "Folder path does not exist!" });
        return;
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            event.reply('load-images-reply', { error: "Error reading folder!" });
            return;
        }

        // Filter image files
        // const imageFiles = files.filter(file => {
        //     const ext = path.extname(file).toLowerCase();
        //     return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        // }).map(file => path.join(folderPath, file));

        const Files = getDirectoryFiles(folderPath);

        // Send back the list of image paths
        event.reply('load-images-reply', { images: Files.imagepath , directories : Files.dirpath });
    });
});
