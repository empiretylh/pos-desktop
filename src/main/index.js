import { app, shell, BrowserWindow, ipcRenderer, ipcMain, remote } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import os from 'os'
import uuid from 'uuid';
import { PosPrinter, PosPrintData, PosPrintOptions } from '@3ksy/electron-pos-printer'
import * as path from "path";
const request = require('request');
const fs = require('fs');
import axios from 'axios';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    show: false,
    fullscreen: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })


  // Get the device username
  const username = os.userInfo().username;

  // Generate a unique ID
  const uniqueId = uuid.v4();

  // Send the username and unique ID to the renderer process
  console.log(username, uniqueId);

  ipcMain.handle('device-info', async (event) => {
    return { username, uniqueId }
  })


  ipcMain.handle('print', async (event, arg) => {
    console.log(arg);
    // PosPrinter.print(arg.data, arg.options)
    //   .then(console.log)
    //   .catch((error) => {
    //     console.error(error);
    //   });

  });

  //restart app
  ipcMain.handle('restart-app', async (event, arg) => {
    app.relaunch();
    app.exit();
  });

  ipcMain.handle('save-profile-img', async (event, arg) => {

    const blobUrl = arg.imageurl;
    const response = await axios({
      url: blobUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(
      path.resolve(__dirname, '../../resources/profile.png')
    );

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  });

  //save image and return path
  const saveImagefrombase64 = async (base64) => {
    const base64Data = base64.replace(/^data:image\/png;base64,/, "");
    const filename = `voucher.png`;

    const tempDir = os.tmpdir();
    const filepath = path.resolve(tempDir, filename);

    fs.writeFile(filepath, base64Data, 'base64', function (err) {
      console.log(err);
    });

    return filepath;
  }


  ipcMain.handle('print-image', async (event, arg) => {
    let image_dataurl = arg.image;

    let filepath = await saveImagefrombase64(image_dataurl);
    // let filepath ="C:/Users/Kaung Si Thu Hein\Downloads\thura.png"

    // console.log(filepath)

    console.log(arg.width_img, arg.height_img)

    const printWindow = new BrowserWindow({
      show: false,
      width: arg.width_img,
      height: arg.height_img,
      webPreferences: {
        nodeIntegration: true,

      }
    });


    let customPageSize = {
      width : arg.paper == '58' ? 580000 : 800000,
      height : arg.paper == '58' ? 2100000 : 32760000,
    }

    console.log(customPageSize) 


    printWindow.loadURL(path.join(__dirname, '../../resources/print.html?image=' + filepath + '&width=' + arg.width_img + '&height=' + arg.height_img));
    printWindow.webContents.on('did-finish-load', () => {
      printWindow.webContents.print({
        silent: arg.paper == 'A4' || arg.paper == 'A5' ? false : true,
        printBackground: true,
        deviceName: arg.options.printerName,
        margins: {
          marginType:'printableArea'
        },
        pageRanges: '1-1',
        pageSize: arg.paper == '58' || arg.paper == '80' ? customPageSize : arg.paper,
        
      });

      setTimeout(() => {
       printWindow.close();
      }, 50000);
    }
    );


  });




  ipcMain.handle('getAllPrinters', async (event, arg) => {
    const printers = await event.sender.getPrintersAsync();
    console.log(printers)
    return printers;
  });






  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()



  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


const pixelToMicrons = (pixels, dpi=203) => {
  return pixels * (25.4 / dpi) * 1000;
};
