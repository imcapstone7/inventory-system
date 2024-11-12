import { NextResponse } from "next/server";
import { ref, get, remove } from "firebase/database";
import { database } from "@/firebase";  // Adjust this path to match your firebase config

export async function POST(req: Request) {
    const { userId, otp } = await req.json();

    try {
        // Reference to the user's OTP data in Firebase Realtime Database
        const otpRef = ref(database, `otpRequests/${userId}`);
        
        // Retrieve the OTP and timestamp from Firebase
        const snapshot = await get(otpRef);

        if (snapshot.exists()) {
            const { OTP: storedOtp, timestamp } = snapshot.val();

            // Check if OTP matches and if it’s within the valid time period (not expired)
            const isValid = storedOtp === otp && timestamp > Date.now();

            if (isValid) {
                // OTP is valid and hasn't expired; remove it from the database
                await remove(otpRef);
                
                return NextResponse.json({ status: 200, message: 'OTP verified successfully.' });
            }

            // OTP is invalid or expired
            return NextResponse.json({ status: 400, message: 'Invalid or expired OTP.' });
        } else {
            // No OTP found for the provided userId
            return NextResponse.json({ status: 404, message: 'OTP not found for this user.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ status: 500, message: 'Error verifying OTP. Please try again.' });
    }
}
