import usbtmc

def list_usb_printers():
    # Find all USB devices connected to the system
    devices = usbtmc.list_devices()
    print(devices)
    if devices:
        print("USB Printers:")
        for device in devices:
            print(f"Device: {device}")
    else:
        print("No USB printers found.")

def print_to_usb_printer(device, text):
    # Write text to the USB printer
    with device as printer:
        printer.write(text)

if __name__ == "__main__":
    # Step 1: List USB printers
    list_usb_printers()

    # Step 2: Print to a USB printer (replace 'device_index' with the appropriate index)
    device_index = 0
    text_to_print = "Hello, USB Printer!\n"

    devices = usbtmc.list_devices()
    print(devices)
    if devices:
        usb_printer = devices[device_index]

        # Step 3: Print to the selected USB printer
        print_to_usb_printer(usb_printer, text_to_print)
    else:
        print("No USB printers found.")
