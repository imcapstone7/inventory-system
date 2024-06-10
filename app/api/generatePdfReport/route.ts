import { NextResponse } from "next/server";
import createPdfReport from "@/hook/pdfReport";
import { ref, set } from "firebase/database";
import { database } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/action";

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

function generateShortUUID1() {
    return uuidv4().replace(/-/g, '').substring(0, 13);
}


export async function POST(req: Request) {

    const session = await getSession();

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
        

        await set(ref(database, `logs/${generateShortUUID1()}`), {
            userId: session.uid,
            action: `Generated an Inventory Report`,
            createdAt: Date.now()
        });

        return response;
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}
