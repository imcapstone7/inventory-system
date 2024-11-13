import { app } from "@/firebase";
import { getSession } from "@/lib/action";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    const auth = getAuth(app);

    const body = await req.json();
    const { email, password, user } = body;

    const session = await getSession();

    try {
        if (user !== null) {
            const id = user.uid;
            session.uid = user.uid;
            session.email = user.email || '';
            session.photoUrl = user.photoURL || '';
            session.isLoggedIn = true;
            await session.save();

            return NextResponse.json({ status: 200, id });
        }
    } catch (error) {
        console.log('SESSION', error);
        return NextResponse.json("Internal error", { status: 500 });
    }
}