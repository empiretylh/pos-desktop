const printer = require('printer');

// List available printers
console.log('Available Printers:');
const printers = printer.getPrinters();
printers.forEach(printer => {
    console.log(printer.name);
});

// Specify the printer name
const printerName = 'Your_Printer_Name';

// Print a text document
const textToPrint = 'Hello, Printer!\nThis is a test print.';
const jobFromText = printer.printDirect({
    data: textToPrint,
    printer: printerName,
    type: 'RAW',
    success: function (jobID) {
        console.log(`Job ID: ${jobID}`);
    },
    error: function (err) {
        console.error('Error printing:', err);
    },
});
