import { dataWithCreatedAtAsStringPrint } from '@/app/api/generatePdfPrint/route';
import { PageSizes, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createPdfPrint(reportData: dataWithCreatedAtAsStringPrint[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]); // Specify page size as needed

    const { width, height } = page.getSize();

    const url = 'https://firebasestorage.googleapis.com/v0/b/inventory-system-5f079.appspot.com/o/icon-light.png?alt=media&token=f415033a-26e6-450e-9af5-5e5ba3670ab6'
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
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
    page.drawText('TRANSPORTS REPORT', {
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
    page.drawText('User-Who-Added', { x: 130, y: currentY, size: 8 });
    page.drawText('Receiver', { x: 230, y: currentY, size: 8 });
    page.drawText('Item', { x: 300, y: currentY, size: 8 });
    page.drawText('Purpose', { x: 400, y: currentY, size: 8 });
    page.drawText('Return Date', { x: 490, y: currentY, size: 8 });
    page.drawText('Status', { x: 600, y: currentY, size: 8 });
    page.drawText('Created At', { x: 650, y: currentY, size: 8 });
    currentY -= lineHeight;

    // Add table content
    reportData.forEach((item) => {
        currentY -= lineHeight;
        page.drawText(item.user, { x: 130, y: currentY, size: 8 });
        page.drawText(item.receiver, { x: 230, y: currentY, size: 8 });
        page.drawText(item.item, { x: 300, y: currentY, size: 8 });
        page.drawText(item.purpose, { x: 400, y: currentY, size: 8 });
        page.drawText(item.returnDate, { x: 490, y: currentY, size: 8 });
        page.drawText(item.status, { x: 600, y: currentY, size: 8 });
        page.drawText(item.createdAt, { x: 650, y: currentY, size: 8 });
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

export default createPdfPrint;