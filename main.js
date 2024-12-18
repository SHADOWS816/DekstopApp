const{app ,BrowserWindow} = require('electron')

function createwindow(){
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true
        }
    })
    win.loadFile("index2.html")
}

app.on('before-quit',()=>{
    console.warn("call before quit app")
})

// app.whenReady().then(createwindow);
app.on('ready',()=>{
    createwindow();
    console.warn(app.isReady())
    console.warn("app is ready you can write some code here.")
})