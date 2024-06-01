import { database, storage } from "@/firebase";
import { getSession } from "@/lib/action";
import { ref as databaseRef, get, set } from "firebase/database";
import { ref as storageRef, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createCanvas } from "canvas";
import JsBarcode from "jsbarcode";

function generateShortUUID() {
    return uuidv4().replace(/-/g, '').substring(0, 11);
}

async function isBarcodeValueUnique(barcodeValue: string) {
    const snapshot = await get(databaseRef(database, `inventory/${barcodeValue}`));
    return !snapshot.exists();
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

        await set(databaseRef(database, `inventory/${barcodeValue}`), {
            barcodeImageUrl: barcodeImageUrl,
            inventoryName: values.inventoryName,
            description: values.description,
            category: values.category,
            contents: values.contents,
            quantity: values.quantity,
            location: values.location,
            status: values.status,
            createdAt: Date.now()
        });

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}