const { ipcRenderer } = require('electron');

const path = require('path');
const fs = require('fs');
const folderInput = document.getElementById('folderPath');
const imageContainer = document.getElementById('imageContainer');
const parentDirectoryName = document.getElementById('directoryParentPathDisplay');
const directoryName = document.getElementById('directoryPathDisplay');
const photosList = document.getElementById('photos_list');
const albumsList = document.getElementById('albums_list');

const photosListArray = ['Library', 'Favorites', 'Places', 'People', 'Recent'];
const albumsListArray = ['Videos', 'Selfies', 'Screenshots'];

// Add an event listener to trigger on 'Enter' key press
function validatePath(newPath){
    console.log(newPath);
    if (fs.existsSync(newPath)){
        console.log(`loading from ${newPath}`);
        loadImages(newPath);
    }else{
        folderInput.focus();
    }
}

folderInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        validatePath(folderInput.value);
        folderInput.value = "";
    }
});

photosListArray.forEach( photo => {
    const divPhotos = `<li class="list">
                            <div class="flex justify-start"> 
                                <img src="icons/blue-folder.svg" width="20px" height="20px" class="mx-2"/>
                                <p class="list">${photo}</p>
                            </div>
                        </li>`;
    photosList.insertAdjacentHTML('beforeend', divPhotos);
});

albumsListArray.forEach( album => {
    const divAlbums = `<li class="list">
                            <div class="flex justify-start"> 
                                <img src="icons/blue-folder.svg" width="20px" height="20px" class="mx-2"/>
                                <p class="list">${album}</p>
                            </div>
                        </li>`;
    albumsList.insertAdjacentHTML('beforeend',divAlbums);
});


function loadImages(inputPath) {
    const folderPath = inputPath;
    const parentPath = path.basename(path.dirname(folderPath));
    const newPath = path.basename(folderPath);

    console.log(newPath);
    console.log(parentPath);
    parentDirectoryName.textContent = parentPath;
    directoryName.textContent = newPath;
    imageContainer.innerHTML = ''; // Clear previous images

    ipcRenderer.send('load-images', folderPath); // Send folder path to backend
}

// Replace forward slashes with backslashes


// Receive image paths from the backend
ipcRenderer.on('load-images-reply', (event, data) => {
    console.log("images came");
    if (data.error) {
        alert(data.error);
        return;
    }
    console.log(data);
    console.log(data.directories);


    // data.images.forEach(imagePath => {
    //     const directory_name = path.basename(imagePath)
    //     const folderDiv = `<div class="folder p-1 flex flex-col items-center hover:bg-blue-50 transition">
    //                             <img src="icons/blue-folder.svg" width="40px" height="40px" />
    //                             <p class="text-gray-800 font-medium text-center truncate w-full">${directory_name}</p>
    //                         </div>`;
    //     imageContainer.insertAdjacentHTML('beforeend', folderDiv);
    // });

    if (data.images.length != 0){
        data.images.forEach(function(image) {
            const imageName = path.basename(image);
            const imageDiv = `<div class="folder p-1 flex flex-col items-center hover:bg-blue-50 transition">
                                <img src="${image}" width="40px" height="40px" class="rounded-md"/>
                                <p class="text-gray-800 font-medium text-center truncate w-full">${imageName}</p>
                            </div>`;
            imageContainer.insertAdjacentHTML('beforeend', imageDiv);
        });
    };

    if (data.directories.length != 0){

        data.directories.forEach(function(dir){
            const directorypath = dir.toString(); 
            const dirName = path.basename(dir);
            const dirDiv = `<div class="folder p-1 flex flex-col items-center hover:bg-blue-50 transition"  >
                                <img src="icons/blue-folder.svg" width="40px" height="40px" />
                                <p class="text-gray-800 font-medium text-center truncate w-full">${dirName}</p> 
                            </div>`;

            const divElement = document.createElement('div');
            divElement.innerHTML = dirDiv;

            divElement.addEventListener('click', () => {
                loadImages(directorypath); 
            });

            imageContainer.appendChild(divElement); 
        });
    };
    // console.log(data.images);
    // console.log(data.directories);
});

