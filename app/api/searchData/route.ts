import Inventory from "@/app/(dashboard)/inventory-page/page";
import { Transport } from "@/app/(dashboard)/transports-page/components/column";
import { database } from "@/firebase";
import { getSession } from "@/lib/action";
import { get, ref, set } from "firebase/database";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
    req: Request,
) {

    function generateShortUUID1() {
        return uuidv4().replace(/-/g, '').substring(0, 13);
    }

    const session = await getSession();
    const body = await req.json();
    const { values } = body;
    let formatData: Inventory | Transport;

    try {

        if (!values.search) {
            return NextResponse.json({ error: 'ID is required.' });
        }

        const snapshot = await get(ref(database, `inventory/${values.search}`));
        const snapshot1 = await get(ref(database, `transport/${values.search}`));
        if (!snapshot.exists()) {
            if (!snapshot1.exists()) {
                return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
            } else {
                const snapData = snapshot1.val();
                formatData = {
                    id: values.search,
                    barcodeImageUrl: snapData.barcodeImageUrl,
                    user: snapData.user,
                    item: snapData.item,
                    receiver: snapData.receiver,
                    purpose: snapData.purpose,
                    returnDate: snapData.returnDate,
                    status: snapData.status,
                    createdAt: snapData.createdAt,
                }

                await set(ref(database, `logs/${generateShortUUID1()}`), {
                    userId: session.uid,
                    action: `Tracked an item's status and state`,
                    createdAt: Date.now()
                });
            }
        } else {
            const snapData = snapshot.val();
            formatData = {
                id: values.search,
                barcodeImageUrl: snapData.barcodeImageUrl,
                category: snapData.category,
                contents: snapData.contents,
                createdAt: snapData.createdAt,
                description: snapData.description,
                inventoryName: snapData.inventoryName,
                location: snapData.location,
                quantity: snapData.quantity,
                status: snapData.status
            } as Inventory;

            await set(ref(database, `logs/${generateShortUUID1()}`), {
                userId: session.uid,
                action: `Tracked an inventory status and state`,
                createdAt: Date.now()
            });
        }

        return NextResponse.json({ status: 200, formatData });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}