import { dataWithCreatedAtAsString } from '@/app/api/generatePdfReport/route';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createPdfBarcode(reportData: dataWithCreatedAtAsString[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]); // Specify page size as needed

    let { width, height } = page.getSize();

    const url = 'https://firebasestorage.googleapis.com/v0/b/inventory-system-5f079.appspot.com/o/philsca-icon.png?alt=media&token=d1774b50-aed8-48d3-ba64-ac8fd4f753d2';
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const iconImage = await pdfDoc.embedPng(arrayBuffer);

    page.drawImage(iconImage, {
        x: 50,
        y: height - 100, // Adjust the position as needed
        width: 80,
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
    const columnCount = 3;
    const columnWidth = 150;
    const barcodeWidth = 130;
    const barcodeHeight = 70;
    const xOffset = 50;
    const yOffset = height - 200;
    const padding = 20;
    const maxTextWidth = columnWidth - 20; // Maximum width for text in each column

    let currentX = xOffset;
    let currentY = yOffset;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    function wrapText(text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, 12);

            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    for (const item of reportData) {
        // Fetch barcode image
        const barcodeArrayBuffer = await fetch(item.barcodeImageUrl).then(res => res.arrayBuffer());
        const barcodeImage = await pdfDoc.embedPng(barcodeArrayBuffer);

        // Draw item name with wrapping
        const wrappedText = wrapText(item.inventoryName, maxTextWidth);

        // Adjust position for each line of wrapped text
        wrappedText.forEach((line, index) => {
            page.drawText(line, {
                x: currentX,
                y: currentY - (index * 14), // Adjust line height for each wrapped line
                size: 12,
                color: rgb(0, 0, 0),
                font: font,
            });
        });

        const totalTextHeight = wrappedText.length * 14;

        // Draw barcode image
        page.drawImage(barcodeImage, {
            x: currentX,
            y: currentY - totalTextHeight - barcodeHeight - 15, // Adjust Y position based on text height
            width: barcodeWidth,
            height: barcodeHeight,
        });

        currentX += columnWidth + padding; // Move to the next column

        // Check if we've reached the end of the row
        if (currentX + columnWidth + padding > width) {
            currentX = xOffset; // Reset X to the first column
            currentY -= barcodeHeight + totalTextHeight + 35; // Move down to the next row

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

export default createPdfBarcode;
