import { database } from "@/firebase";
import { format, parse, parseISO } from "date-fns";
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

        const date = parseISO(values.returnDate);
        const time = parse(values.returnTime, 'HH:mm', new Date());
        const formattedDate = format(date, 'MMMM dd, yyyy');
        const formattedTime = format(time, 'hh:mm a');

        await update(ref(database, `transport/${id}`), {
            receiver: values.receiver,
            purpose: values.purpose,
            item: values.item,
            status: values.status,
            returnDate: `${formattedDate} ${formattedTime}`
        });

        const inventoryRef = ref(database, `inventory/${values.itemId}`);
        const inventorySnapshot = await get(inventoryRef);

        if (!inventorySnapshot.exists()) {
            throw new Error('Inventory item does not exist');
        }

        const currentQuantity = inventorySnapshot.val().quantity;
        const newQuantity = currentQuantity + 1;

        // Update inventory quantity
        await update(inventoryRef, {
            quantity: newQuantity
        });


        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}