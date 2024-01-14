/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import { PosPrinter, PosPrintData, PosPrintOptions } from '@alvarosacari/electron-pos-printer'
import * as path from "path";


const options = {
    preview: false,
    width: '170px',
    margin: '0 0 0 0',
    copies: 1,
    printerName: 'POS-58-Series',
    timeOutPerLine: 400,
    pageSize: { height: 301000, width: 71000 } // page size
}

const data = [
    {
        type: 'image'
        , path: path.join(__dirname, '../../resources/profile.png')
        , position: 'center'
        , width: '60px'
        , height: '60px'
    }
]


export default function print() {
    PosPrinter.print(data, options)
        .then(() => {
            console.log('Print ok');
        })
        .catch((error) => {
            console.error(error);
        }

}

