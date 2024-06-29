import { database, storage } from "@/firebase";
import { getSession } from "@/lib/action";
import { ref as databaseRef, get, set, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";
import { format, parse, parseISO } from "date-fns";

function generateShortUUID() {
    return uuidv4().replace(/-/g, '').substring(0, 11);
}

function generateShortUUID1() {
    return uuidv4().replace(/-/g, '').substring(0, 13);
}

async function isBarcodeValueUnique(barcodeValue: string): Promise<boolean> {
    const snapshot = await get(databaseRef(database, `inventory/${barcodeValue}`));
    if (!snapshot.exists()) {
        const snapshot1 = await get(databaseRef(database, `transport/${barcodeValue}`));
        return !snapshot1.exists();
    }
    return false;
}

export async function POST(
    req: Request,
) {
    const session = await getSession();
    const body = await req.json();
    const { values } = body;

    let barcodeValue: string = '';
    let unique = false;

    while (!unique) {
        barcodeValue = generateShortUUID();
        unique = await isBarcodeValueUnique(barcodeValue);
    }

    const canvas = createCanvas(300, 100);

    JsBarcode(canvas, barcodeValue, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true
    });

    const barcodeBuffer = canvas.toBuffer("image/png");
    const barcodePath = `barcodes/${barcodeValue}.png`;
    const barcodeStorageRef = storageRef(storage, barcodePath);

    try {
        await uploadBytes(barcodeStorageRef, barcodeBuffer);
        const barcodeImageUrl = await getDownloadURL(barcodeStorageRef);

        const date = parseISO(values.returnDate);
        const time = parse(values.returnTime, 'HH:mm', new Date());
        const formattedDate = format(date, 'MMMM dd, yyyy');
        const formattedTime = format(time, 'hh:mm a');

        await set(databaseRef(database, `transport/${barcodeValue}`), {
            barcodeImageUrl: barcodeImageUrl,
            user: session.email,
            itemId: values.itemId,
            item: values.item,
            receiver: values.receiver,
            purpose: values.purpose,
            createdAt: Date.now(),
            status: 'Borrowed',
            returnDate: `${formattedDate} ${formattedTime}`,
        });

        const inventoryRef = databaseRef(database, `inventory/${values.itemId}`);
        const inventorySnapshot = await get(inventoryRef);

        if (!inventorySnapshot.exists()) {
            throw new Error('Inventory item does not exist');
        }

        const currentQuantity = inventorySnapshot.val().quantity;
        const newQuantity = currentQuantity - 1;

        // Update inventory quantity
        await update(inventoryRef, {
            quantity: newQuantity
        });

        await set(databaseRef(database, `logs/${generateShortUUID1()}`), {
            userId: session.uid,
            action: `Added a data in Transports`,
            createdAt: Date.now()
        });

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log('TRANSPORT', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}