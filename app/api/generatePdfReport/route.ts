import { NextResponse } from "next/server";
import createPdfReport from "@/hook/pdfReport";

export interface dataWithCreatedAtAsString {
    createdAt: string;
    id: string;
    barcodeImageUrl: string;
    category: string;
    contents: string;
    description: string;
    inventoryName: string;
    location: string;
    quantity: string;
    status: string;
}

export async function POST(req: Request) {
    const body: dataWithCreatedAtAsString[] = await req.json();
    const data = body;
    
    try {
        if (!data) {
            throw new Error('No data provided');
        }

        // Create PDF report
        const pdfBytes = await createPdfReport(data);

        // Return PDF as response
        const response = new Response(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf'
            }
        });

        return response;
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}
