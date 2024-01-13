import usb.core
from escpos.printer import Usb

def list_usb_devices():
    # Find all USB devices connected to the system
    devices = usb.core.find(find_all=True)

    if devices is not None:
        print("USB Devices:")
        for device in devices:
            print(f"Device: {device.idVendor} {device.idProduct}")
    else:
        print("No USB devices found.")

def print_to_usb_printer():
    # Replace 'vendor_id' and 'product_id' with the values specific to your USB printer
    printer = Usb(hex(2501), hex(22590), 0)

    try:
        # Send a text message to the printer
        printer.text("Hello, USB Printer!\n")
        printer.cut()
    finally:
        # Close the printer connection
        printer.close()

if __name__ == "__main__":
    # Step 1: List USB devices
    list_usb_devices()
    # Step 2: Print to USB printer
    print_to_usb_printer()
