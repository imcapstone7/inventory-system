import createPdfPrint from "@/hook/pdfPrint";
import { getSession } from "@/lib/action";
import { NextResponse } from "next/server";
import { ref, set } from "firebase/database";
import { database } from "@/firebase";
import { v4 as uuidv4 } from "uuid";

export interface dataWithCreatedAtAsStringPrint {
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

function generateShortUUID1() {
    return uuidv4().replace(/-/g, '').substring(0, 13);
}

export async function POST(req: Request) {

    const session = await getSession();
    const body: dataWithCreatedAtAsStringPrint[] = await req.json();
    const data = body;
    
    try {
        if (!data) {
            throw new Error('No data provided');
        }

        // Create PDF report
        const pdfBytes = await createPdfPrint(data);

        // Return PDF as response
        const response = new Response(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf'
            }
        });

        await set(ref(database, `logs/${generateShortUUID1()}`), {
            userId: session.uid,
            action: `Printed the Transport Records`,
            createdAt: Date.now()
        });

        return response;
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}
