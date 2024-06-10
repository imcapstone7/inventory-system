import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface dataWithCreatedAtAsString {
    createdAt: string;
    id: string;
    barcodeImageUrl: string;
    user: string;
    item: string;
    receiver: string;
    purpose: string;
    returnDate: string;
    status: string;
}

async function createPdfBarcode1(reportData: dataWithCreatedAtAsString[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]); // Specify page size as needed

    let { width, height } = page.getSize();

    const url = 'https://firebasestorage.googleapis.com/v0/b/inventory-system-5f079.appspot.com/o/icon-light.png?alt=media&token=f415033a-26e6-450e-9af5-5e5ba3670ab6'
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const iconImage = await pdfDoc.embedPng(arrayBuffer);

    page.drawImage(iconImage, {
        x: 50,
        y: height - 100, // Adjust the position as needed
        width: 100,
        height: 100,
    });

    const currentDate = new Date().toLocaleDateString();
    page.drawText(currentDate, {
        x: width - 150,
        y: height - 50, // Adjust the position as needed
        size: 12,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });

    // Add header
    page.drawText('INVENTORY BARCODES', {
        x: width / 2.4 - 50,
        y: height - 150,
        size: 20,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });

    // Add content
    // Add content
    const columnCount = 3;
    const columnWidth = 150;
    const barcodeWidth = 130;
    const barcodeHeight = 70;
    const xOffset = 50;
    const yOffset = height - 200;
    const padding = 20;

    let currentX = xOffset;
    let currentY = yOffset;

    for (const item of reportData) {
        // Fetch barcode image
        const barcodeArrayBuffer = await fetch(item.barcodeImageUrl).then(res => res.arrayBuffer());
        const barcodeImage = await pdfDoc.embedPng(barcodeArrayBuffer);

        // Draw item name
        page.drawText(item.item, {
            x: currentX,
            y: currentY,
            size: 12,
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        });

        // Draw barcode image
        page.drawImage(barcodeImage, {
            x: currentX, // Adjust the X position as needed
            y: currentY - barcodeHeight - 15, // Adjust the Y position as needed
            width: barcodeWidth, // Adjust the width as needed
            height: barcodeHeight, // Adjust the height as needed
        });

        currentX += columnWidth + padding; // Move to the next column

        // Check if we've reached the end of the row
        if (currentX + columnWidth + padding > width) {
            currentX = xOffset; // Reset X to the first column
            currentY -= barcodeHeight + 35; // Move down to the next row

            // Check if there's enough space for another row, otherwise add a new page
            if (currentY < barcodeHeight + 35) {
                page = pdfDoc.addPage([600, 800]);
                currentX = xOffset;
                currentY = height - 50;
                ({ width, height } = page.getSize());
            }
        }
    }

    // Save PDF to buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

export default createPdfBarcode1;
