import { dataWithCreatedAtAsString } from '@/app/api/generatePdfReport/route';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createPdfReport(reportData: dataWithCreatedAtAsString[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Specify page size as needed

    const { width, height } = page.getSize();

    const url = 'https://firebasestorage.googleapis.com/v0/b/inventory-system-5f079.appspot.com/o/philsca-icon.png?alt=media&token=d1774b50-aed8-48d3-ba64-ac8fd4f753d2'
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
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

    // Add table content
    reportData.forEach((item) => {
        currentY -= lineHeight;
        page.drawText(item.inventoryName, { x: 50, y: currentY, size: 12 });
        page.drawText(item.category, { x: 200, y: currentY, size: 12 });
        page.drawText(item.quantity.toString(), { x: 310, y: currentY, size: 12 });
        page.drawText(item.location, { x: 370, y: currentY, size: 12 });
        page.drawText(item.status, { x: 460, y: currentY, size: 12 });
    });

    // Add footer
    page.drawText('End of Report', {
        x: width / 2 - 50,
        y: 50,
        size: 12,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });

    // Save PDF to buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

export default createPdfReport;