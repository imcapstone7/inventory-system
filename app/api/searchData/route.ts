import Inventory from "@/app/(dashboard)/inventory-page/page";
import { database } from "@/firebase";
import { get, ref } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {

    const body = await req.json();
    const { values } = body;

    try {

        if (!values.search) {
            return NextResponse.json({ error: 'ID is required.' });
        }

        const snapshot = await get(ref(database, `inventory/${values.search}`));

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
        }

        const data = snapshot.val();

        const formatData: Inventory = {
            id: values.search,
            barcodeImageUrl: data.barcodeImageUrl,
            category: data.category,
            contents: data.contents,
            createdAt: data.createdAt,
            description: data.description,
            inventoryName: data.inventoryName,
            location: data.location,
            quantity: data.quantity,
            status: data.status
        }

        return NextResponse.json({ status: 200, formatData });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}