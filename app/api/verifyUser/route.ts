import { database } from "@/firebase";
import { ref, remove, update } from "firebase/database";
import { NextResponse } from "next/server";



export async function POST(
    req: Request,
) {
    const body = await req.json();
    const { id } = body;

    try {

        if (!id) {
            return NextResponse.json({ error: 'ID is required.' });
        }

        await update(ref(database, `mobile/users/${id}`), {
            verified: true
        });

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log('INVENTORY', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}