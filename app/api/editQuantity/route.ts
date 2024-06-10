import { database } from "@/firebase";
import { get, ref, update } from "firebase/database";
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

        const itemRef = ref(database, `inventory/${id}`);

        const snapshot = await get(itemRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
        }

        const currentData = snapshot.val();
        const lowStock = 0.5 * Number(currentData.baseQuantity);
        const baseQuantity = Number(currentData.baseQuantity);
        
        if (values.quantity >= baseQuantity) {
            await update(itemRef, { baseQuantity: values.quantity, quantity: values.quantity, status: "Available" });
            return NextResponse.json({ status: 200 });
        } else if (values.quantity > lowStock) {
            await update(itemRef, { quantity: values.quantity, status: "Available" });
            return NextResponse.json({ status: 200 });
        } else if (values.quantity <= lowStock) {
            await update(itemRef, { quantity: values.quantity, status: "Low Stock" });
            return NextResponse.json({ status: 200 });
        } else {
            await update(ref(database, `inventory/${id}`), { quantity: values.quantity, status: "Out of Stock" });
            return NextResponse.json({ status: 200 });
        }


    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}