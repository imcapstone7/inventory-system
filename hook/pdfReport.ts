import { dataWithCreatedAtAsString } from '@/app/api/generatePdfReport/route';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Function to wrap text within the available width
function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + (currentLine.length > 0 ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, size);

        if (width <= maxWidth) {
            currentLine = testLine;
        } else {
            if (currentLine.length > 0) {
                lines.push(currentLine);
            }
            currentLine = word; // Start new line with the current word
        }
    });

    if (currentLine.length > 0) {
        lines.push(currentLine); // Push the last line
    }

    return lines;
}

async function createPdfReport(reportData: dataWithCreatedAtAsString[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]); // Specify page size as needed
    let { width, height } = page.getSize();

    const url = 'https://firebasestorage.googleapis.com/v0/b/inventory-system-5f079.appspot.com/o/philsca-icon.png?alt=media&token=d1774b50-aed8-48d3-ba64-ac8fd4f753d2'
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
    page.drawText('INVENTORY REPORT', {
        x: width / 2.4 - 50,
        y: height - 150,
        size: 20,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });

    // Add content
    const contentStartY = height - 200;
    let currentY = contentStartY;
    const lineHeight = 20;

    // Add table header
    page.drawText('Item', { x: 50, y: currentY, size: 12 });
    page.drawText('Category', { x: 200, y: currentY, size: 12 });
    page.drawText('Quantity', { x: 310, y: currentY, size: 12 });
    page.drawText('Location', { x: 370, y: currentY, size: 12 });
    page.drawText('Status', { x: 460, y: currentY, size: 12 });
    currentY -= lineHeight;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const maxWidth = 130; // Adjust as per your available space for text

    // Add table content
    reportData.forEach((item, index) => {
        currentY -= lineHeight;

        // Check if we need a new page
        if (currentY < 50) {
            page = pdfDoc.addPage([600, 800]); // Add new page
            ({ width, height } = page.getSize()); // Update the page size
            currentY = height - 200; // Reset Y position
        }

        // Wrap text for each column to avoid overflow
        const itemLines = wrapText(item.inventoryName, font, 12, maxWidth);
        const categoryLines = wrapText(item.category, font, 12, maxWidth);
        const quantityLines = wrapText(item.quantity.toString(), font, 12, maxWidth);
        const locationLines = wrapText(item.location, font, 12, maxWidth);
        const statusLines = wrapText(item.status, font, 12, maxWidth);

        // Draw each wrapped line for the item
        itemLines.forEach((line, lineIndex) => {
            page.drawText(line, { x: 50, y: currentY - lineIndex * lineHeight, size: 12 });
        });
        categoryLines.forEach((line, lineIndex) => {
            page.drawText(line, { x: 200, y: currentY - lineIndex * lineHeight, size: 12 });
        });
        quantityLines.forEach((line, lineIndex) => {
            page.drawText(line, { x: 310, y: currentY - lineIndex * lineHeight, size: 12 });
        });
        locationLines.forEach((line, lineIndex) => {
            page.drawText(line, { x: 370, y: currentY - lineIndex * lineHeight, size: 12 });
        });
        statusLines.forEach((line, lineIndex) => {
            page.drawText(line, { x: 460, y: currentY - lineIndex * lineHeight, size: 12 });
        });

        currentY -= Math.max(itemLines.length, categoryLines.length, quantityLines.length, locationLines.length, statusLines.length) * lineHeight;
    });

    // Save PDF to buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

export default createPdfReport;
