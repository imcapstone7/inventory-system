import { database } from "@/firebase";
import { ref, update } from "firebase/database";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {

    const body = await req.json();
    const { values, id } = body;

    try {

        if (!id) {
            return NextResponse.json({ error: 'ID is required.' });
        }

        await update(ref(database, `inventory/${id}`), {
            inventoryName: values.inventoryName,
            description: values.description,
            category: values.category,
            contents: values.contents,
            location: values.location,
            status: values.status
        });

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}